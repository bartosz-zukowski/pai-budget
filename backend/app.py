from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  


# Konfiguracja bazy danych SQLite
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'budget.db') # Ścieżka do pliku bazy danych
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)

# Debugowanie ścieżki bazy danych
@app.before_request
def debug_db_path():
    if not hasattr(app, '_db_path_checked'): # Upewnij się, że drukuje się tylko raz
        print(f"DEBUG: Configured DB URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print(f"DEBUG: Absolute DB file path: {os.path.join(basedir, 'budget.db')}")
        app._db_path_checked = True # Oznacz, że zostało to już sprawdzone

# Model bazy danych dla transakcji
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(10), nullable=False) # 'income' lub 'expense'
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow) # Data transakcji

    def __repr__(self):
        return f"<Transaction {self.title} - {self.amount}>"

    # Metoda pomocnicza do serializacji obiektu na słownik, aby można było go zwrócić jako JSON
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'amount': self.amount,
            'category': self.category,
            'type': self.type,
            'date': self.date.isoformat() + 'Z' # Format ISO 8601, z 'Z' oznaczającym UTC
        }

# ---- Endpointy API ----

# Utworzenie bazy danych
@app.before_request
def create_tables():
    if not hasattr(app, '_database_initialized'):
        with app.app_context():
            db.create_all()
            app._database_initialized = True


# Nowy endpoint do serwowania pliku index.html
@app.route('/')
def serve_index():
    return render_template('index.html')

# Dodawanie nowej transakcji
@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    title = data.get('title')
    amount = data.get('amount')
    category = data.get('category')
    type = data.get('type')
    date_str = data.get('date') # Data jako string, np. '2023-10-26T14:30:00Z'

    # Walidacja danych wejściowych
    if not all([title, amount, category, type, date_str]):
        return jsonify({'message': 'Missing data. Required: title, amount, category, type, date'}), 400
    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({'message': 'Amount must be a positive number'}), 400
    if type not in ['income', 'expense']:
        return jsonify({'message': 'Type must be "income" or "expense"'}), 400
    try:
        transaction_date = datetime.fromisoformat(date_str.replace('Z', ''))
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use ISO 8601 (e.g., 2023-10-26T14:30:00Z)'}), 400


    new_transaction = Transaction(
        title=title,
        amount=amount,
        category=category,
        type=type,
        date=transaction_date
    )

    try:
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify(new_transaction.to_dict()), 201 # 201 Created
    except Exception as e:
        db.session.rollback() # Wycofaj zmiany w przypadku błędu
        print(f"Błąd podczas dodawania transakcji: {e}") # Debugging
        return jsonify({'message': f'Server error while adding transaction: {str(e)}'}), 500


# Pobieranie wszystkich transakcji
@app.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([t.to_dict() for t in transactions])

# Pobieranie pojedynczej transakcji
@app.route('/transactions/<int:id>', methods=['GET'])
def get_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    return jsonify(transaction.to_dict())

# Edycja transakcji
@app.route('/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    transaction = db.session.get(Transaction, id) # Użyj db.session.get dla pewności
    if transaction is None:
        return jsonify({'message': 'Transaction not found'}), 404
        
    data = request.json

    if not data:
        return jsonify({'message': 'No data provided'}), 400

    # Aktualizacja pól transakcji na podstawie danych wejściowych
    transaction.title = data.get('title', transaction.title)
    transaction.amount = data.get('amount', transaction.amount)
    transaction.category = data.get('category', transaction.category)
    transaction.type = data.get('type', transaction.type)

    if 'date' in data:
        try:
            # Przetwarzanie daty z formatu ISO 8601
            transaction.date = datetime.fromisoformat(data['date'].replace('Z', ''))
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use ISO 8601 (e.g., 2023-10-26T14:30:00Z)'}), 400

    # Dodatkowa walidacja dla pól, jeśli są aktualizowane
    if not isinstance(transaction.amount, (int, float)) or transaction.amount <= 0:
        return jsonify({'message': 'Amount must be a positive number'}), 400
    if transaction.type not in ['income', 'expense']:
        return jsonify({'message': 'Type must be "income" or "expense"'}), 400

    try:
        db.session.commit()
        return jsonify(transaction.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"Błąd podczas aktualizacji transakcji: {e}") # Debugging
        return jsonify({'message': f'Server error while updating transaction: {str(e)}'}), 500

# Usuwanie transakcji
@app.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = db.session.get(Transaction, id) # Użyj db.session.get dla pewności
    if transaction is None:
        return jsonify({'message': 'Transaction not found'}), 404

    try:
        db.session.delete(transaction)
        db.session.commit()
        return jsonify({'message': 'Transaction deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Błąd podczas usuwania transakcji: {e}") # Debugging
        return jsonify({'message': f'Server error while deleting transaction: {str(e)}'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True, port=5000) # Uruchamia aplikację Flask na porcie 5000