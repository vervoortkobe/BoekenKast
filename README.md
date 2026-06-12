# BoekenKast

Deze webapplicatie biedt een overzichtelijke en geordende lijst van alle boeken en stripboeken in mijn persoonlijke collectie.

Ik heb deze applicatie ontwikkeld om te allen tijde een handig overzicht te hebben van mijn verzameling. Hierdoor kan ik eenvoudig bijhouden welke strips ik reeds bezit en welke nog op mijn verlanglijstje staan. Daarnaast is de app zeer praktisch voor het beheren van uitleningen, zodat ik altijd weet aan wie ik een specifiek exemplaar heb toevertrouwd.

## Leerdoelen

Dit project diende tevens als een leerervaring om mijn vaardigheden in moderne webtechnologieën aan te scherpen. Hoewel ik al enige ervaring had met **NestJS**, was dit mijn eerste volwaardige project met **Vue.js**. De keuze voor Vue was gebaseerd op de vele voordelen die het framework biedt, zoals de reactieve data-binding, de modulaire component-structuur en de uitstekende prestaties in de browser.

## Configuratie

Om deze applicatie lokaal te hosten, dien je de volgende omgevingsvariabelen in te stellen in een `.env` bestand (zie ook `example.env`):

| Variabele       | Beschrijving                                    | Voorbeeldwaarde             |
| :-------------- | :---------------------------------------------- | :-------------------------- |
| `PORT`          | De poort waarop de backend server draait.       | `3000`                      |
| `DATABASE_URL`  | De verbindingsstring voor de database (Prisma). | `file:./prisma/dev.db`      |
| `AUTH_USERNAME` | De gebruikersnaam voor Basic Authentication.    | `admin`                     |
| `AUTH_PASSWORD` | Het wachtwoord voor Basic Authentication.       | `geheim-wachtwoord`         |
| `VITE_API_URL`  | De URL van de backend API voor de frontend.     | `http://localhost:3000/api` |
