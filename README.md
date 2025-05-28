# Osobisty Menedżer Budżetu 1.0

Osobisty Menedżer Budżetu to prosta, ale skuteczna aplikacja webowa, która pomoże Ci śledzić Twoje dochody i wydatki. Zbudowana z użyciem **Flask** na backendzie oraz **HTML, CSS i JavaScript** na frontendzie, zapewnia intuicyjny interfejs do zarządzania finansami osobistymi, monitorowania salda i wizualizacji wydatków.

---

## Cechy

* **Logowanie użytkownika** - wersja 1.1: Prosty system logowania zabezpiecza dostęp do Twoich danych finansowych.
* **Dodawanie transakcji**: Łatwo dodawaj nowe dochody i wydatki z tytułem, kwotą, kategorią i datą.
* **Edycja i usuwanie transakcji**: Pełna kontrola nad Twoimi danymi finansowymi dzięki możliwości edycji i usuwania istniejących transakcji.
* **Aktualne saldo**: Natychmiastowy podgląd Twojego aktualnego bilansu finansowego.
* **Wykres wydatków**: Wizualizacja rozkładu Twoich wydatków na kategorie za pomocą interaktywnego wykresu kołowego (Chart.js).
* **Responsywny design**: Aplikacja wygląda i działa świetnie na różnych urządzeniach (komputery, tablety, smartfony).
* **Dane**: Transakcje są zapisywane w pliku JSON na serwerze, dzięki czemu dane nie znikają po zamknięciu aplikacji.

---

## Struktura Projektu

Projekt jest podzielony na dwie główne części:

* `backend/`: Zawiera logikę serwera Flask (`app.py`) i plik z danymi (`transactions.json`).
* `frontend/`: Zawiera pliki interfejsu użytkownika (HTML, CSS, JavaScript).

---

## Wymagania

Aby uruchomić aplikację, potrzebujesz:

* **Python 3.x**
* **pip** (menedżer pakietów Pythona)

---

## Instalacja i Uruchomienie

Wykonaj poniższe kroki, aby zainstalować i uruchomić aplikację:

1.  **Sklonuj lub pobierz repozytorium** (jeśli jest hostowane na GitHubie, w przeciwnym razie stwórz strukturę folderów i umieść w nich pliki):
    ```bash
    git clone [https://github.com/bartosz-zukowski/pai-budget.git](https://github.com/bartosz-zukowski/pai-budget.git)
    cd pai-budget
    ```

2.  **Przejdź do katalogu `backend`**:
    ```bash
    cd backend
    ```

3.  **Utwórz i aktywuj wirtualne środowisko** (zalecane):
    * **Na Windowsie**:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    * **Na macOS/Linux**:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

4.  **Zainstaluj wymagane pakiety Pythona**:
    ```bash
    pip install Flask Flask-CORS Flask-Login Werkzeug
    ```
    lub
    ```bash
    pip install -r requirements.txt
    ```

6.  **Uruchom aplikację Flask**:
    ```bash
    python app.py
    ```
    Serwer Flask zostanie uruchomiony na adresie `http://127.0.0.1:5000`.

7.  **Otwórz aplikację w przeglądarce**:
    Przejdź do `http://127.0.0.1:5000/` w swojej ulubionej przeglądarce.

7.  **W razie problemow**:
    Uruchom python app.py i otworz plik index.html w przegladarce.
---

## Logowanie

Domyślne dane logowania (zdefiniowane w `backend/app.py`):

* **Nazwa użytkownika**: `admin`
* **Hasło**: `haslo_admina`

**Pamiętaj**: W pliku `app.py` znajduje się sekcja, w której możesz zmienić domyślne hasło administratora na własne, używając funkcji `generate_password_hash` z `werkzeug.security` w konsoli Pythona i wklejając wygenerowany hash.

---

## Użycie

Po zalogowaniu możesz:

* Dodawać nowe transakcje, wypełniając formularz.
* Edytować istniejące transakcje, klikając przycisk "Edytuj" obok nich.
* Usuwać transakcje, klikając przycisk "Usuń".
* Monitorować swoje saldo i przeglądać wykres wydatków.

---

## Dalszy Rozwój

Ten projekt może być rozbudowywany o wiele dodatkowych funkcji, takich jak:

* Panel Logowania.
* Filtrowanie wydatkow
* Generowanie raportów finansowych (np. miesięczne, roczne).
* Ustawianie budżetów dla poszczególnych kategorii.
* Funkcje resetowania hasła.
* Eksportowanie danych do CSV/Excel.

---

## Licencja

Ten projekt jest udostępniony na licencji MIT.

---

**Autor**: [Bartosz Żukowski, Jagoda Brodowicz, Hubert Romanik, Kuba Trochimiuk, Łukasz Puchajda]
