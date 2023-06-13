# "OneStop" transporta sarakstu sistēma

Kvalifikācijas darba uzdevums ir izveidot OneStop mobīlo aplikāciju, kas nodrošinās precīzāku informāciju par sabiedrisko transportu ar interaktīvu kartes funkcionalitāti, iespēju publicēt ziņas un komentēt tās, kā arī lietotāju pārvaldību. Aplikācijas galvenais mērķis ir uzlabot pasažieru pieredzi, nodrošinot ērtu piekļuvi precīzai un aktuālai informācijai par sabiedrisko transportu, iespēju plānot ceļojumus un dalīties ar pieredzi.
OneStop aplikācijai ir jāpilda vairākas funkcionalitātes, tai skaitā:
1. Attēlot aktuālus sabiedriskā transporta sarakstus un maršrutu informāciju;
1. Sniegt informāciju par pieturu atrašanās vietām;
1. Integrēt datus no Rīgas Satiksmes par transporta kustību;
1. Attēlot maršrutu, pieturu un citus svarīgus transporta elementus uz kartes;
1. Ļaut lietotājiem plānot ceļojumus un apskatīt maršrutu detalizāciju;
1. Nodrošināt kartes pārvilkšanu un tuvināšanu, lai lietotāji varētu viegli pārlūkot karti;
1. Ļaut lietotājiem publicēt ziņas par kavējumiem, neparedzētām izmaiņām u.c.;
1. Ļaut citiem lietotājiem komentēt un sniegt atsauksmes par publicētajām ziņām;
1. Nodrošināt administratoriem iespēju moderēt un dzēst ziņas un komentārus;
1. Ļaut lietotājiem izveidot kontus, veikt pieteikšanos un atjaunot paroles;
1. Nodrošināt e-pasta verifikāciju, lai pārliecinātos par lietotāju autentiskumu;
1. Ieviest lietotāju lomu sistēmu ar atšķirīgām tiesībām, piemēram, klientu un administratoru lomas.


## UZDEVUMA RISINĀŠANAS LĪDZEKĻU IZVĒLES PAMATOJUMS

Sistēmas izstrādāšanas procesā ir izmantoti dažādi programmēšanas valodas, izstrādes vides, rīki un tehnoloģijas, kuru izvēle ir pamatota sekojošām apsvērumiem:

Backend daļas izstrādei tika izvēlēta Typescript programmēšanas valoda, kopā ar Express un Apollo Server ietvariem. Typescript nodrošina statisko tipizāciju un palīdz samazināt kļūdu skaitu izstrādes procesā. Express nodrošina vieglu un efektīvu REST API izveidi, savukārt Apollo Server ir izmantots GraphQL API realizācijai. Izstrādes videi tika izmantota Neovim, kas nodrošina ērtu un produktīvu programmēšanas vidē ar dažādām palīgprogrammām un atbalstu Typescript valodai.

Sistēmas datu glabāšanai un iegūšanai no datubāzes tika izvēlēts PostgreSQL. Tas ir atvērtā koda objektu-relāciju datubāzes pārvaldības sistēma ar plašām iespējām un drošības funkcijām. Prisma tika izmantots kā datubāzes pieslēguma rīks, kas nodrošina ērtu un efektīvu veidu, kā izveidot savienojumu starp backendu un datubāzi.

Lietotāja saskarnes izstrādei tika izvēlēts Expo un React Native, kas nodrošina ātru un vieglu mobilo lietotņu izstrādi. Expo ir izstrādes rīks, kas vienkāršo mobilo lietotņu izstrādi un piedāvā dažādas papildu iespējas, piemēram, ērtu saskaņošanu ar mobilo ierīču platformām  Tas ļauj izstrādāt un testēt aplikāciju tieši uz iOS ierīces, vienkāršojot izstrādes procesu. React Native ir atvērtā koda ietvars, kas ļauj izveidot kvalitatīvas un veiktspējīgas mobilo lietotņu lietotāja saskarnes, izmantojot JavaScript valodu.

Datu bāzei tika izvēlēta PostgreSQL, kas ir spēcīga objektu-relāciju datubāzes pārvaldības sistēma ar plašām iespējām un drošības funkcijām. Prisma tika izmantots kā datubāzes pieslēguma rīks, kas nodrošina ērtu un efektīvu veidu, kā izveidot savienojumu starp backendu un datubāzi.

Backend izstrādes procesā tika izmantota Express un Apollo Server, kas nodrošina efektīvu REST API un GraphQL API izveidi. Express ir populārs un stabils ietvars, kas piedāvā daudzas iespējas API izveidei un apstrādei. Apollo Server ir izmantots kā GraphQL API ietvars, kas sniedz papildu fleksibilitāti un efektivitāti datu pārraidē starp klientu un serveri.  

Lai nodrošinātu drošu un ērtu izstrādi, tika izmantoti dažādi rīki un tehnoloģijas, tostarp Docker, kas piedāvā iespēju viegli hostēt un darbināt datubāzi un backendu, kā arī nodrošina izolāciju un portabilitāti.

Kopumā, izvēloties šos risinājumus, kā programmēšanas valodu Typescript, Express un Apollo Server kā backend ietvarus, PostgreSQL kā datubāzes pārvaldības sistēmu, Expo un React Native kā frontend izstrādes rīkus, kā arī Docker kā uzglabāšanas un izpildes rīku, mēs esam nodrošinājuši drošu, veiktspējīgu un ērti pielāgojamu aplikācijas izstrādi.

Šie izvēlētie risinājumi atbilst sistēmas prasībām un sniedz nepieciešamo funkcionalitāti, ātrdarbību, drošību, pārnesamību un lietotāja interfeisu. Tādējādi tie veicina mūsu aplikācijas augstāku kvalitāti un lietotāju pieredzi, nodrošinot stabilu un efektīvu risinājumu mūsu uzdevuma izpildei.


## INFORMĀCIJAS AVOTI

1. [ANG] Express: Sīkāka informācija par Express ietvaru un dokumentāciju ir pieejama šeit: https://expressjs.com/en/starter/installing.html – (Resurss apskatīts 2.05.2023.)
1. [ANG] Apollo Server: Papildus informācija par Apollo Server un tā dokumentāciju ir atrodama šajā saitē: https://www.apollographql.com/docs/apollo-server/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] body-parser: Express vidē paredzēta bibliotēka, kas analizē ienākošus HTTP pieprasījumus un atgriež to saturu JSON formātā. Dokumentāciju var atrast šeit: https://www.npmjs.com/package/body-parser – (Resurss apskatīts 1.05.2023.)
1. [ANG] csvtojson: Bibliotēka, kas ļauj konvertēt CSV failus uz JSON formātu. Dokumentāciju var atrast šeit: https://www.npmjs.com/package/csvtojson – (Resurss apskatīts 1.05.2023.)
1. [ANG] dotenv-safe: Bibliotēka, kas nodrošina drošu .env faila ielādi. Dokumentāciju var atrast šeit: https://www.npmjs.com/package/dotenv-safe – (Resurss apskatīts 1.05.2023.)
1. [ANG] nodemailer: Bibliotēka, kas ļauj nosūtīt e-pastu no servera. Dokumentāciju var atrast šeit: https://nodemailer.com/about/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] yup: Bibliotēka, kas nodrošina datu validācijas shēmas veidošanu un validāciju. Dokumentāciju var atrast šeit: https://github.com/jquense/yup – (Resurss apskatīts 1.05.2023.)
1. [ANG] graphql: GraphQL ir valoda un izpildlaika vide datu vaicājumu un manipulāciju veikšanai. Dokumentāciju var atrast šeit: https://www.npmjs.com/package/graphql. – (Resurss apskatīts 1.05.2023.)
1. [ANG] PostgreSQL: Plašāka informācija un PostgreSQL dokumentācija ir pieejama šeit: https://www.postgresql.org/files/documentation/pdf/13/postgresql-13-A4.pdf – (Resurss apskatīts 1.05.2023.)
1. [ANG] Prisma: Uzziniet vairāk par Prisma un tās dokumentāciju šajā saitē: https://www.prisma.io/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] @prisma/client: Prisma klienta bibliotēka, kas ļauj veikt datu bāzes darbības, izmantojot Prisma ORM. Dokumentāciju var atrast šeit: https://www.prisma.io/docs/concepts/components/prisma-client – (Resurss apskatīts 1.05.2023.)
1. [ANG] Expo: Uzziniet vairāk par Expo izstrādes rīku un skatiet tā dokumentāciju šeit: https://docs.expo.dev/ – (Resurss apskatīts 2.05.2023.)
1. [ANG] React Native: Papildus informācija un React Native dokumentāciju ir atrodama šajā saitē: https://reactnative.dev/docs/0.61/enviroment-setup – (Resurss apskatīts 1.05.2023.)
1. [ANG] formik: Formik ir bibliotēka, kas nodrošina vienkāršu veidlapu pārvaldību un validāciju React lietojumprogrammās. Dokumentāciju var atrast šeit: https://formik.org/docs/guides/react-native – (Resurss apskatīts 1.05.2023.)
1. [ANG] @emotion/native: is bibliotēka, kas paredzēta css stilu rakstīšanai, izmantojot JavaScript. Dokumentāciju var atrast šeit: https://emotion.sh/docs/@emotion/native  – (Resurss apskatīts 1.05.2023.)
1. [ANG] expo-location: Expo Location ir Expo bibliotēka, kas nodrošina piekļuvi ierīces atrašanās vietas informācijai. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/location/  – (Resurss apskatīts 1.05.2023.)
1. [ANG] react-native-gesture-handler: React Native Gesture Handler ir bibliotēka, kas nodrošina gestu atpazīšanu un apstrādi React Native lietojumprogrammās. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/gesture-handler/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] react-native-maps: React Native Maps ir bibliotēka, kas nodrošina iespēju iekļaut kartes un to funkcionalitāti React Native lietojumprogrammās. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/map-view/   – (Resurss apskatīts 1.05.2023.)
1. [ANG] react-native-reanimated: React Native Reanimated ir bibliotēka, kas nodrošina augstu veiktspēju animāciju un darbību veikšanu React Native lietojumprogrammās. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/reanimated/  – (Resurss apskatīts 1.05.2023.)
1. [ANG] react-native-safe-area-context: React Native Safe Area Context ir bibliotēka, kas nodrošina drošas laukuma zonas vadību React Native lietojumprogrammās. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/safe-area-context/  – (Resurss apskatīts 1.05.2023.)
1. [ANG] react-native-screens: React Native Screens ir bibliotēka, kas nodrošina efektīvāku ekrāna pārvaldību React Native lietojumprogrammās. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/screens/  – (Resurss apskatīts 1.05.2023.)
1. [ANG] react-native-svg: React Native SVG ir bibliotēka, kas nodrošina SVG (Scalable Vector Graphics) atbalstu React Native lietojumprogrammās. Dokumentāciju var atrast šeit: https://docs.expo.dev/versions/latest/sdk/svg/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] Google Maps: Sīkāka informācija un Google Maps ietvara dokumentācija ir pieejama šeit: https://developers.google.com/maps/documentation – (Resurss apskatīts 2.05.2023.)
1. [ANG] Informācija par formātu un struktūru failus, kas ietver GTFS datu kopu. dokumentācija ir pieejama šeit: https://developers.google.com/transit/gtfs/reference/#field_definitions  – (Resurss apskatīts 1.05.2023.)
1. [LAT] Rīgas Satiksme sabiedriskā transporta maršrutu sarakstu dati GTFS txt failu formātā dažādos laika periodos. Saitē ir pieejama šeit : https://data.gov.lv/dati/lv/dataset/marsrutu-saraksti-rigas-satiksme-sabiedriskajam-transportam - (Resurss apskatīts 1.05.2023.)
1. [ANG] Autentifikācijas marķieri un drošība: Uzziniet vairāk par autentifikācijas marķieriem un drošības aspektiem šajā saitē: https://jwt.io/introduction/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] bcrypt: Bibliotēka, kas nodrošina drošu paroļu kriptogrāfiju. Dokumentāciju var atrast šeit.
1. [ANG] Drošības pamatprincipi: Iepazīstieties ar drošības pamatprincipiem šeit: https://owasp.org/www-project-top-ten/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] Diagrammu veidošanas rīks - https://app.diagrams.net/ – (Resurss apskatīts 1.05.2023.)
1. [ANG] Detalizēts skaidrojums par to, kā darbojas Haversina formula. - https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128#:~:text=For%20example%2C%20haversine(%CE%B8),longitude%20of%20the%20two%20points. – (Resurss apskatīts 1.05.2023.)
1. [ANG] React Native modulis, kas apstrādā kartes klasterizāciju. - https://github.com/venits/react-native-map-clustering – (Resurss apskatīts 1.05.2023.)
1. [ANG] Bibliotēka, kas palīdz izveidot lietotājam draudzīgas nolaižamās izvēlnes. – https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/advanced/dropdown-box – (Resurss apskatīts 1.05.2023.)
1. [ANG] Instrukcija par to, kā uzstādīt postgresql datubāzi - https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm – (Resurss apskatīts 1.05.2023.)


## Backend uzstādīšana

Pārliecinieties, vai jums ir instalēts Node.js, npm un git. Lai to pārbaudītu, izpildiet šādas komandas terminālī vai komandrindā:

```
node -v
npm -v
git -v
```

Ja redzat versijas numurus, tas nozīmē, ka tie ir veiksmīgi instalēti.
Pārliecinieties, vai jums ir instalēta PostgreSQL datubāze, izmantojot šo resursu (sk. inf. avoti 33.) Lai sāktu, nokopējiet mūsu GitHub projekta repozitoriju, izmantojot šo saiti (sk. 11. pielikums)
Pēc tam pārvietojieties uz "backend" mapi, izmantojot termināli vai komandrindu:

```
cd OneStop/backend
```

Izpildiet komandu "npm install", lai instalētu visas atkarības:

```
npm install
```

Tas ielādēs un uzstādīs visus nepieciešamos moduļus un bibliotēkas, kas ir norādītas failā "package.json".
Pēc tam izpildiet komandu prisma generate, lai ģenerētu Prisma klientu, izmantojot noklusēto "schema.prisma" ceļu:

```
npx prisma generate
```

Tas ģenerēs Prisma klienta kodi, kas ir nepieciešams, lai mijiedarbotos ar datubāzi.

Pēc tam izpildiet komandu prisma migrate, lai sinhronizētu shēmu ar datubāzi:

```
npx prisma migrate dev
```

Izveidojiet ".env" failu, kurā norādiet vajadzīgos iestatījumus:
	
```
PORT=
DATABASE_URL=
```

"DATABASE_URL" laukā jums jānorāda PostgreSQL datubāzes URL, un "PORT" laukā jūs varat ievadīt portu, kurā jūsu serveris tiks palaists.
Tālāk izpildiet komandu "npm run syncBusData", lai parsētu transporta datus:

```
npm run syncBusData
```

Tas ļaus iegūt un apstrādāt transporta datus, kas ir nepieciešami sistēmas darbībai.
Kad jūs esat paveicis visus iepriekš minētos soļus, jūs varat izveidot un palaist savu serveri, izpildot šo komandu:

```
npm start
```

Tas iedarbinās jūsu backend serveri http://localhost:4000/ un http://192.168.118.132:4000/ un ļaus jums sākt lietot un testēt aplikāciju (skat. 6.1. attēlu un 6.2 attēlu).


## Fronend uzstādīšana

Tagad, kad esam izveidojuši servera pusi, ir pienācis laiks strādāt pie priekšējās daļas. Šeit ir norādījumi, kā palaist esošo Expo lietotni:
Izmantojot iepriekš sniegtos norādījumus, pārliecinieties, ka jūsu backend ir jau pilnībā instalēts un darbojas.
Pārliecinieties, ka ir instalēta Expo CLI. Ja tā nav instalēta, izpildiet šo komandu, lai to instalētu:

```
npm install -g expo-cli
```

Pārlūkojiet aplikācijas frontend mapi, izmantojot komandu cd frontend vai atbilstoši projekta struktūrai.

```
cd frontend
```

Lai instalētu visas nepieciešamās paketes frontend aplikācijai, izpildiet komandu npm install. Tas nodrošinās, ka visi atkarīgie moduļi tiks lejupielādēti un instalēti vietējā frontend projektā.

```
npm install
```

Lai palaistu Expo lietotni frontend projektā, izpildiet komandu "npm start". Tā iedarbinās Expo izstrādes serveri un parādīs QR kodu, kas norāda lietotnes izstrādes versiju (skat. 6.3. attēlu).

```
npm start
```

