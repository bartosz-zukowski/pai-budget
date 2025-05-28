# Osobisty Menedżer Budżetu

Osobisty Menedżer Budżetu to prosta, ale skuteczna aplikacja webowa, która pomoże Ci śledzić Twoje dochody i wydatki. Zbudowana z użyciem **Flask** (z **Flask-SQLAlchemy** do zarządzania bazą danych) na backendzie oraz **HTML, CSS i JavaScript** na frontendzie, zapewnia intuicyjny interfejs do zarządzania finansami osobistymi, monitorowania salda i wizualizacji wydatków.

---

## Cechy

* **Dodawanie transakcji**: Łatwo dodawaj nowe dochody i wydatki z tytułem, kwotą, kategorią i datą.
* **Edycja i usuwanie transakcji**: Pełna kontrola nad Twoimi danymi finansowymi dzięki możliwości edycji i usuwania istniejących transakcji.
* **Aktualne saldo**: Natychmiastowy podgląd Twojego aktualnego bilansu finansowego.
* **Wykres wydatków**: Wizualizacja rozkładu Twoich wydatków na kategorie za pomocą interaktywnego wykresu kołowego (Chart.js).
* **Responsywny design**: Aplikacja wygląda i działa świetnie na różnych urządzeniach (komputery, tablety, smartfony).
* **Dane**: Transakcje są bezpiecznie zapisywane w lokalnej bazie danych **SQLite** (`budget.db`), dzięki czemu dane nie znikają po zamknięciu aplikacji.

---

## Struktura Projektu

Projekt ma następującą strukturę katalogów:
backend/static - script.js oraz style.css
backend/templates - index.html
backend - folder dla środowiska wirtualnego oraz plików app.py, budget.db
README.md
requirements.txt
---

## Wymagania

Aby uruchomić aplikację, potrzebujesz:

* **Python 3.x**
* **pip** (menedżer pakietów Pythona)

---

## Instalacja i Uruchomienie

Wykonaj poniższe kroki, aby zainstalować i uruchomić aplikację:

1.  **Sklonuj lub pobierz repozytorium**:
    ```bash
    git clone https://github.com/bartosz-zukowski/pai-budget.git
    cd pai-budget
    ```

2.  **Utwórz i aktywuj wirtualne środowisko** (zalecane):
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

3.  **Zainstaluj wymagane pakiety Pythona**:
    ```bash
    pip install Flask Flask-SQLAlchemy Flask-CORS
    ```
    lub
    ```bash
    pip install -r requirements.txt
    ```

4.  **Uruchom aplikację Flask**:
    Z folderu backend uruchom:
    ```bash
    python app.py
    ```
    Serwer Flask zostanie uruchomiony na adresie `http://127.0.0.1:5000/`. W konsoli zobaczysz również ścieżkę, pod którą tworzony/odczytywany jest plik `budget.db`.

5.  **Otwórz aplikację w przeglądarce**:
    Przejdź do `http://127.0.0.1:5000/` w swojej ulubionej przeglądarce.

---

## Użycie

Po uruchomieniu aplikacji w przeglądarce możesz:

* Dodawać nowe transakcje, wypełniając formularz.
* Edytować istniejące transakcje, klikając przycisk "Edytuj" obok nich.
* Usuwać transakcje, klikając przycisk "Usuń".
* Monitorować swoje saldo i przeglądać wykres wydatków.

---

## Dalszy Rozwój

Ten projekt może być rozbudowywany o wiele dodatkowych funkcji, takich jak:

* Panel logowania i zarządzanie użytkownikami.
* Filtrowanie i sortowanie transakcji (np. według daty, kategorii, typu).
* Generowanie raportów finansowych (np. miesięczne, roczne).
* Ustawianie budżetów dla poszczególnych kategorii.
* Eksportowanie danych do formatów CSV/Excel.

---

## Licencja

Ten projekt jest udostępniony na licencji MIT.

---

**Autor**: [Bartosz Żukowski, Jagoda Brodowicz, Hubert Romanik, Kuba Trochimiuk, Łukasz Puchajda]