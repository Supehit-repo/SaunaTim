Sauna Tim
=========

Sauna Tim on selaimessa pelattava löylynheittopeli, jossa Tim ja Ivan kilpailevat siitä, kumpi saa vastustajan paahtumaan ensin.

Pelin avaaminen
---------------

Avaa index.html selaimessa suoraan tästä kansiosta:

E:\Pelit\SaunaTIM\SaunaTim\index.html

Peli ei vaadi build-vaihetta, palvelinta tai asennettavia riippuvuuksia. Kaikki JavaScript-tiedostot ladataan tavallisina selaimen script-tiedostoina, jotta peli toimii myös staattisena selainpelinä.

Pelaaminen
----------

- Vedä hiirellä tai kosketuksella Timin kauhasta taaksepäin ja päästä irti.
- Mitä lähempänä osuma on kiukaan keskikohtaa, sitä enemmän lämpöä vastustaja saa.
- Paras kolmesta erästä voittaa ottelun.
- Ivan aloittaa toisen erän.
- Pitkään tähtääminen heikentää tarkkuutta maltillisesti.
- Vedon aikana näkyy vain dynaaminen heittokaari. Taustassa ei ole pysyvää vanaa kauhasta kiukaalle.

Nykyiset pääominaisuudet
------------------------

- Canvas-pohjainen 1280 x 720 -peli, joka skaalautuu selaimessa 16:9 landscape-näkymään.
- Pelin logiikka, renderöinti, efektit ja järjestelmät on jaettu useaan tiedostoon jatkokehitystä varten.
- Tausta, hahmot ja kiuas perustuvat alkuperäiseen demovisuaaliin.
- Energia näkyy muodossa 350/350 ja sen perässä on sydän. Mittarissa ei näytetä HP-tekstiä.
- Molemmille pelaajille näkyvät erävoitot.
- Timin ja Ivanin päiden yläpuolella on saunamittarit, joiden lämpö nousee osumien myötä noin 65 asteesta 100 asteeseen.
- Seinän saunamittarit on nostettu hieman kauemmas hahmojen päistä.
- Kiukaassa on tulipesä, puut ja osumista voimistuvia liekkiefektejä.
- 90 pisteen ja sitä paremmat osumat saavat tulipesän liekit elävämmiksi.
- Pelissä on kevyet selaimessa tuotetut ääniefektit: hieman pidempi veden suhaus, tulen pieni rätinä, kierrosfanfari ja Ivanin ähkäisy, kun hän on lähellä häviötä.
- Kauhat/kauhatyyliset heittovälineet liikkuvat heiton aikana, vaikka pelimekaniikka on edelleen sama vedä ja päästä irti -heitto.

Äänet mobiilissa
-----------------

- iOS:ssä ääni aktivoituu ensimmäisestä kosketuksesta. Jos puhelin on äänettömällä, poista äänetön tila pelin ääniä varten.

Valikko
-------

- Oikean yläkulman burger-valikosta löytyvät Asetukset, tietosuojaseloste, käyttöehdot ja versionumero.
- Asetuksista voi kytkeä pelin äänet päälle tai pois. Valinta muistetaan selaimessa.

Kehitys
-------

Muokkaa tiedostoja suoraan src-kansiossa. Säilytä index.html suoraan avattavana: älä lisää bundleria tai moduuli-importteja ilman erillistä päätöstä.
