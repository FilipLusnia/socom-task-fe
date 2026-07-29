# Zadanie SoCom FE

Stack: Next.js, TS, React Query, Zod, Tailwind + shadcn, MSW

Next został użyty ze względu na prostotę tworzenia projektu i wygodę, nie ze względu na potencjał użycia SSR/SSG - aplikacja wertuje duże ilości danych, co w takim przypadku mogło by już mocno obciążać serwer

## Funkcjonalności

### Lista zamówień

Zaimplementowano:
- paginację po stronie serwera
- wyszukiwanie po numerze zamówienia oraz e-mailu klienta
- filtrowanie po wielu statusach jednocześnie oraz po zakresie dat
- sortowanie po dacie utworzenia oraz po wartości zamówienia (należy kliknąć w nagłówki tabeli)
- skeletony zamiast loaderów
- obsługę błędów z możliwością ponowienia zapytania
- pusty stan i osobny stan dla braku wyników przy aktywnych filtrach

### Szczegóły zamówienia

Szczegóły zamówienia są wyświetlane w panelu bocznym. Da się podejrzeć:
- dane klienta
- listę pozycji zamówienia
- aktualny status
- historię zmian statusu

### Zarządzanie statusem zamówienia

Zmiana statusu jest kontrolowana przez zdefiniowane przejścia pomiędzy statusami.

Zaimplementowano:
- wyświetlanie tylko dostępnych przejść statusów
- walidację zmian po stronie API
- optymistyczne aktualizacje interfejsu
- rollback w przypadku błędu
- obsługę niedozwolonych przejść statusów

Każda zmiana statusu zapisuje historię zawierającą:
- poprzedni status
- nowy status
- datę zmiany
- użytkownika wykonującego zmianę (poglądowo, mock)
- opcjonalny powód (poglądowo, mock)

### Masowa zmiana statusów

Zaimplementowano:
- zaznaczanie wielu zamówień
- zmianę statusu dla wielu rekordów jednocześnie
- obsługę częściowego powodzenia operacji

API zwraca informacje o:
- zamówieniach zaktualizowanych poprawnie
- zamówieniach, których nie udało się zmienić
- powodach niepowodzenia


## API

### GET `/api/orders`

Zwraca listę zamówień z obsługą paginacji, wyszukiwania, filtrowania, sortowania

### GET `/api/orders/:id`

Zwraca pełne dane pojedynczego zamówienia takie jak klient, pozycje zamówienia, historia statusów

### PATCH `/api/orders/:id/status`

Zmienia status pojedynczego zamówienia po sprawdzeniu poprawności przejścia.

### POST `/api/orders/bulk-status`

Zmienia status wielu zamówień jednocześnie. Obsługuje częściowe powodzenie operacji.

### GET `/api/orders/stats`

Zwraca zagregowane statystyki, np. liczbę zamówień według statusów czy obrót z ostatnich 30 dni

Endpoint przygotowany jest pod dalszą rozbudowę panelu administracyjnego, np.: jakiś modal lub wykresy itp. Obecnie nie posiada UI.


## Decyzje architektoniczne

### React Query

- zarządzania stanem serwerowym
- cache'owania danych
- obsługi mutacji
- optymistycznych aktualizacji
- invalidacji zapytań

### Zod

Wykorzystany jako warstwa walidacji danych pomiędzy API a frontendem.

### MSW

Wykorzystany do symulacji backendu.

Obsługuje:
- opóźnienia sieciowe
- błędy API
- paginację, filtry i sort
- zmianę statusów - poj. i masową

## Możliwe dalsze usprawnienia

Przy większej ilości czasu można byłoby dodać:

- prawdziwą implementację backendową z agregacją danych po stronie bazy danych - tu szczególnie załuję, że nie wystarczyło mi czasu
- eksport zamówień do CSV
- rzeczywiste dane użytkownika wykonującego zmianę statusu
- rozbudowany dashboard statystyk