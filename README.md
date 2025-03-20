# Transportation Management System (TMS)

## Opis projektu
Transportation Management System (TMS) to aplikacja webowa służąca do zarządzania zleceniami transportowymi w firmie logistycznej. Projekt został zbudowany przy użyciu **React** i **TypeScript**, z wykorzystaniem **Tailwind CSS** do stylizacji. Umożliwia zarządzanie oddziałami firmy, użytkownikami, pojazdami, kierowcami oraz generowanie raportów.

## Główne funkcjonalności
- **Zarządzanie zleceniami**: Tworzenie, edycja i usuwanie zleceń transportowych z przypisaniem do oddziałów.
- **Oddziały firmy**: Możliwość przypisywania zleceń i użytkowników do konkretnych oddziałów.
- **Panel logowania**: System uwierzytelniania użytkowników z rolami (administrator, użytkownik).
- **Dashboard**: Widok statystyk (aktywne zlecenia, dzisiejsze dostawy, przychód miesięczny) z filtrowaniem dla administratorów i ograniczeniem do oddziału dla użytkowników.
- **Koszty transportu**: Obliczanie przychodów na podstawie odległości (0.5 zł/km dla busa, 1.2 zł/km dla ciężarówki).
- **Raporty**: Generowanie raportów finansowych i efektywnościowych.
- **Zarządzanie użytkownikami**: Dodawanie nowych użytkowników z przypisaniem do oddziałów (tylko dla administratorów).

## Technologie
- **Frontend**: React, TypeScript, Tailwind CSS
- **Przechowywanie danych**: Local Storage (dla celów demonstracyjnych)
- **Narzędzia**: Vite (build tool), Git

## Wymagania
- Node.js (wersja 18+ zalecana)
- npm

## Instalacja
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoj-username/tms-project.git
