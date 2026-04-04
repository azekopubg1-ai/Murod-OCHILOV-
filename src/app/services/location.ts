import { Injectable } from '@angular/core';

export interface LocationData {
  countries: {
    id: string;
    name: Record<string, string>;
    regions: {
      id: string;
      name: Record<string, string>;
      districts: {
        id: string;
        name: Record<string, string>;
      }[];
    }[];
  }[];
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private data: LocationData = {
    countries: [
      {
        id: 'uz',
        name: { UZ: 'Oʻzbekiston', RU: 'Узбекистан', EN: 'Uzbekistan', QQ: 'Ózbekistan', UZ_KR: 'Ўзбекистон' },
        regions: [
          {
            id: 'toshkent_sh',
            name: { UZ: 'Toshkent shahri', RU: 'г. Ташкент', EN: 'Tashkent City', QQ: 'Toshkent qalası', UZ_KR: 'Тошкент шаҳри' },
            districts: [
              { id: 'bektemir', name: { UZ: 'Bektemir', RU: 'Бектемирский', EN: 'Bektemir', QQ: 'Bektemir' } },
              { id: 'mirobod', name: { UZ: 'Mirobod', RU: 'Мирабадский', EN: 'Mirabad', QQ: 'Mirobod' } },
              { id: 'mirzo_uluǵbek', name: { UZ: 'Mirzo Ulugʻbek', RU: 'Мирзо-Улугбекский', EN: 'Mirzo Ulugbek', QQ: 'Mirzo Uluǵbek' } },
              { id: 'olmazor', name: { UZ: 'Olmazor', RU: 'Алмазарский', EN: 'Olmazor', QQ: 'Almazar' } },
              { id: 'sergeli', name: { UZ: 'Sergeli', RU: 'Сергелийский', EN: 'Sergeli', QQ: 'Sergeli' } },
              { id: 'shayxontohur', name: { UZ: 'Shayxontohur', RU: 'Шайхантахурский', EN: 'Shaykhantakhur', QQ: 'Shayxontohur' } },
              { id: 'yunusobod', name: { UZ: 'Yunusobod', RU: 'Юнусабадский', EN: 'Yunusabad', QQ: 'Yunusobod' } },
              { id: 'yakkasaroy', name: { UZ: 'Yakkasaroy', RU: 'Яккасарайский', EN: 'Yakkasaray', QQ: 'Yakkasaroy' } },
              { id: 'yashnobod', name: { UZ: 'Yashnobod', RU: 'Яшнабадский', EN: 'Yashnabad', QQ: 'Yashnobod' } },
              { id: 'chilonzor', name: { UZ: 'Chilonzor', RU: 'Чиланзарский', EN: 'Chilanzar', QQ: 'Chilonzor' } },
              { id: 'uxtepa', name: { UZ: 'Uchtepa', RU: 'Учтепинский', EN: 'Uchtepa', QQ: 'Uchtepa' } },
              { id: 'yangihayot', name: { UZ: 'Yangihayot', RU: 'Янгихаётский', EN: 'Yangihayot', QQ: 'Yangihayot' } }
            ]
          },
          {
            id: 'toshkent_v',
            name: { UZ: 'Toshkent viloyati', RU: 'Ташкентская область', EN: 'Tashkent Region', QQ: 'Toshkent wálayatı', UZ_KR: 'Тошкент вилояти' },
            districts: [
              { id: 'angren', name: { UZ: 'Angren shahri', RU: 'г. Ангрен', EN: 'Angren', QQ: 'Angren qalası' } },
              { id: 'olmaliq', name: { UZ: 'Olmaliq shahri', RU: 'г. Алмалык', EN: 'Almalyk', QQ: 'Almalıq qalası' } },
              { id: 'chirchiq', name: { UZ: 'Chirchiq shahri', RU: 'г. Чирчик', EN: 'Chirchiq', QQ: 'Chirchiq qalası' } },
              { id: 'bekobod_sh', name: { UZ: 'Bekobod shahri', RU: 'г. Бекабад', EN: 'Bekabad City', QQ: 'Bekobod qalası' } },
              { id: 'nurafshon', name: { UZ: 'Nurafshon shahri', RU: 'г. Нурафшан', EN: 'Nurafshan', QQ: 'Nurafshon qalası' } },
              { id: 'bekobod_v', name: { UZ: 'Bekobod tumani', RU: 'Бекабадский район', EN: 'Bekabad District', QQ: 'Bekobod rayonı' } },
              { id: 'boʻstonliq', name: { UZ: 'Boʻstonliq tumani', RU: 'Бостанлыкский район', EN: 'Bostanlyk District', QQ: 'Bostanlıq rayonı' } },
              { id: 'zangiota', name: { UZ: 'Zangiota tumani', RU: 'Зангиатинский район', EN: 'Zangiata District', QQ: 'Zangiota rayonı' } },
              { id: 'qibray', name: { UZ: 'Qibray tumani', RU: 'Кибрайский район', EN: 'Kibray District', QQ: 'Qibray rayonı' } },
              { id: 'parkent', name: { UZ: 'Parkent tumani', RU: 'Паркентский район', EN: 'Parkent District', QQ: 'Parkent rayonı' } },
              { id: 'piskent', name: { UZ: 'Piskent tumani', RU: 'Пскентский район', EN: 'Piskent District', QQ: 'Piskent rayonı' } },
              { id: 'oqqorgon', name: { UZ: 'Oqqoʻrgʻon tumani', RU: 'Аккурганский район', EN: 'Akkurgan District', QQ: 'Oqqorǵon rayonı' } },
              { id: 'ohangaron', name: { UZ: 'Ohangaron tumani', RU: 'Ахангаранский район', EN: 'Akhangaran District', QQ: 'Ohangaron rayonı' } },
              { id: 'chinoz', name: { UZ: 'Chinoz tumani', RU: 'Чиназский район', EN: 'Chinaz District', QQ: 'Chinoz rayonı' } },
              { id: 'yuqorichirchiq', name: { UZ: 'Yuqorichirchiq tumani', RU: 'Верхнечирчикский район', EN: 'Yukorichirchik District', QQ: 'Joqarıshirshiq rayonı' } },
              { id: 'ortachirchiq', name: { UZ: 'Oʻrtachirchiq tumani', RU: 'Среднечирчикский район', EN: 'Ortachirchik District', QQ: 'Ortashirshiq rayonı' } },
              { id: 'quyichirchiq', name: { UZ: 'Quyichirchiq tumani', RU: 'Нижнечирчикский район', EN: 'Kuyichirchik District', QQ: 'Tómenshirshiq rayonı' } }
            ]
          },
          {
            id: 'andijon',
            name: { UZ: 'Andijon viloyati', RU: 'Андижанская область', EN: 'Andijan Region', QQ: 'Andijon wálayatı', UZ_KR: 'Андижон вилояти' },
            districts: [
              { id: 'andijon_sh', name: { UZ: 'Andijon shahri', RU: 'г. Андижан', EN: 'Andijan City', QQ: 'Andijon qalası' } },
              { id: 'xonobod', name: { UZ: 'Xonobod shahri', RU: 'г. Ханабад', EN: 'Khanabad', QQ: 'Xonobod qalası' } },
              { id: 'andijon_v', name: { UZ: 'Andijon tumani', RU: 'Андижанский район', EN: 'Andijan District', QQ: 'Andijon rayonı' } },
              { id: 'asaka', name: { UZ: 'Asaka tumani', RU: 'Асакинский район', EN: 'Asaka District', QQ: 'Asaka rayonı' } },
              { id: 'baliqchi', name: { UZ: 'Baliqchi tumani', RU: 'Балыкчинский район', EN: 'Balykchi District', QQ: 'Baliqshi rayonı' } },
              { id: 'boz', name: { UZ: 'Boʻz tumani', RU: 'Бозский район', EN: 'Boz District', QQ: 'Boz rayonı' } },
              { id: 'buloqboshi', name: { UZ: 'Buloqboshi tumani', RU: 'Булакбашинский район', EN: 'Bulakbashi District', QQ: 'Bulaqboshi rayonı' } },
              { id: 'izboskan', name: { UZ: 'Izboskan tumani', RU: 'Избасканский район', EN: 'Izboskan District', QQ: 'Izboskan rayonı' } },
              { id: 'jalaquduq', name: { UZ: 'Jalaquduq tumani', RU: 'Джалакудукский район', EN: 'Jalalkuduk District', QQ: 'Jalaquduq rayonı' } },
              { id: 'marhamat', name: { UZ: 'Marhamat tumani', RU: 'Мархаматский район', EN: 'Markhamat District', QQ: 'Marhamat rayonı' } },
              { id: 'oltinkol', name: { UZ: 'Oltinkoʻl tumani', RU: 'Алтынкульский район', EN: 'Altinkul District', QQ: 'Oltinkól rayonı' } },
              { id: 'paxtaobod', name: { UZ: 'Paxtaobod tumani', RU: 'Пахтаабадский район', EN: 'Pakhtaabad District', QQ: 'Paxtaobod rayonı' } },
              { id: 'qorgontepa', name: { UZ: 'Qoʻrgʻontepa tumani', RU: 'Кургантепинский район', EN: 'Kurgantepa District', QQ: 'Qorǵontepa rayonı' } },
              { id: 'shaxrixon', name: { UZ: 'Shahrixon tumani', RU: 'Шахриханский район', EN: 'Shahrikhan District', QQ: 'Shaxrixon rayonı' } },
              { id: 'ulugnor', name: { UZ: 'Ulugʻnor tumani', RU: 'Улугнорский район', EN: 'Ulugnor District', QQ: 'Uluǵnor rayonı' } },
              { id: 'xojaobod', name: { UZ: 'Xoʻjaobod tumani', RU: 'Ходжаабадский район', EN: 'Khojaabad District', QQ: 'Xojaobod rayonı' } }
            ]
          },
          {
            id: 'buxoro',
            name: { UZ: 'Buxoro viloyati', RU: 'Бухарская область', EN: 'Bukhara Region', QQ: 'Buxoro wálayatı', UZ_KR: 'Бухоро вилояти' },
            districts: [
              { id: 'buxoro_sh', name: { UZ: 'Buxoro shahri', RU: 'г. Бухара', EN: 'Bukhara City', QQ: 'Buxoro qalası' } },
              { id: 'kogon_sh', name: { UZ: 'Kogon shahri', RU: 'г. Каган', EN: 'Kagan City', QQ: 'Kogon qalası' } },
              { id: 'buxoro_v', name: { UZ: 'Buxoro tumani', RU: 'Бухарский район', EN: 'Bukhara District', QQ: 'Buxoro rayonı' } },
              { id: 'vobkent', name: { UZ: 'Vobkent tumani', RU: 'Вабкентский район', EN: 'Vabkent District', QQ: 'Vobkent rayonı' } },
              { id: 'gijduvon', name: { UZ: 'Gʻijduvon tumani', RU: 'Гиждуванский район', EN: 'Gijduvan District', QQ: 'Gijduvon rayonı' } },
              { id: 'jondor', name: { UZ: 'Jondor tumani', RU: 'Жондорский район', EN: 'Jondor District', QQ: 'Jondor rayonı' } },
              { id: 'kogon_v', name: { UZ: 'Kogon tumani', RU: 'Каганский район', EN: 'Kagan District', QQ: 'Kogon rayonı' } },
              { id: 'qorakol', name: { UZ: 'Qorakoʻl tumani', RU: 'Каракульский район', EN: 'Karakul District', QQ: 'Qorakól rayonı' } },
              { id: 'qorovulbozor', name: { UZ: 'Qorovulbozor tumani', RU: 'Караулбазарский район', EN: 'Karaulbazar District', QQ: 'Qorovulbozor rayonı' } },
              { id: 'olot', name: { UZ: 'Olot tumani', RU: 'Алатский район', EN: 'Alat District', QQ: 'Olot rayonı' } },
              { id: 'peshku', name: { UZ: 'Peshku tumani', RU: 'Пешкунский район', EN: 'Peshku District', QQ: 'Peshku rayonı' } },
              { id: 'romitan', name: { UZ: 'Romitan tumani', RU: 'Ромитанский район', EN: 'Romitan District', QQ: 'Romitan rayonı' } },
              { id: 'shofirkon', name: { UZ: 'Shofirkon tumani', RU: 'Шафирканский район', EN: 'Shafirkan District', QQ: 'Shofirkon rayonı' } }
            ]
          },
          {
            id: 'jizzax',
            name: { UZ: 'Jizzax viloyati', RU: 'Джизакская область', EN: 'Jizzakh Region', QQ: 'Jizzax wálayatı', UZ_KR: 'Жиззах вилояти' },
            districts: [
              { id: 'jizzax_sh', name: { UZ: 'Jizzax shahri', RU: 'г. Джизак', EN: 'Jizzakh City', QQ: 'Jizzax qalası' } },
              { id: 'arnasoy', name: { UZ: 'Arnasoy tumani', RU: 'Арнасайский район', EN: 'Arnasay District', QQ: 'Arnasoy rayonı' } },
              { id: 'baxtmal', name: { UZ: 'Baxmal tumani', RU: 'Бахмальский район', EN: 'Bakhmal District', QQ: 'Baxmal rayonı' } },
              { id: 'dustlik', name: { UZ: 'Doʻstlik tumani', RU: 'Дустликский район', EN: 'Dustlik District', QQ: 'Dóstlik rayonı' } },
              { id: 'forish', name: { UZ: 'Forish tumani', RU: 'Фаришский район', EN: 'Farish District', QQ: 'Forish rayonı' } },
              { id: 'gallaorol', name: { UZ: 'Gʻallaorol tumani', RU: 'Галляаральский район', EN: 'Gallaorol District', QQ: 'Gallaorol rayonı' } },
              { id: 'sharof_rashidov', name: { UZ: 'Sharof Rashidov tumani', RU: 'Шараф-Рашидовский район', EN: 'Sharof Rashidov District', QQ: 'Sharof Rashidov rayonı' } },
              { id: 'mirzachol', name: { UZ: 'Mirzachol tumani', RU: 'Мирзачульский район', EN: 'Mirzachol District', QQ: 'Mirzachol rayonı' } },
              { id: 'paxtakor', name: { UZ: 'Paxtakor tumani', RU: 'Пахтаakorский район', EN: 'Pakhtakor District', QQ: 'Paxtakor rayonı' } },
              { id: 'yangiobod', name: { UZ: 'Yangiobod tumani', RU: 'Янгиабадский район', EN: 'Yangiobad District', QQ: 'Yangiobod rayonı' } },
              { id: 'zomin', name: { UZ: 'Zomin tumani', RU: 'Зааминский район', EN: 'Zaamin District', QQ: 'Zomin rayonı' } },
              { id: 'zafarobod', name: { UZ: 'Zafarobod tumani', RU: 'Зафарабадский район', EN: 'Zafarobod District', QQ: 'Zafarobod rayonı' } },
              { id: 'zarbdor', name: { UZ: 'Zarbdor tumani', RU: 'Зарбдорский район', EN: 'Zarbdor District', QQ: 'Zarbdor rayonı' } }
            ]
          },
          {
            id: 'qashqadaryo',
            name: { UZ: 'Qashqadaryo viloyati', RU: 'Кашкадарьинская область', EN: 'Kashkadarya Region', QQ: 'Qashqadaryo wálayatı', UZ_KR: 'Қашқадарё вилояти' },
            districts: [
              { id: 'qarshi_sh', name: { UZ: 'Qarshi shahri', RU: 'г. Карши', EN: 'Karshi City', QQ: 'Qarshi qalası' } },
              { id: 'shaxrisabz_sh', name: { UZ: 'Shahrisabz shahri', RU: 'г. Шахрисабз', EN: 'Shahrisabz City', QQ: 'Shaxrisabz qalası' } },
              { id: 'dehqonobod', name: { UZ: 'Dehqonobod tumani', RU: 'Дехканабадский район', EN: 'Dehkanabad District', QQ: 'Dehqonobod rayonı' } },
              { id: 'kasbi', name: { UZ: 'Kasbi tumani', RU: 'Касбинский район', EN: 'Kasbi District', QQ: 'Kasbi rayonı' } },
              { id: 'kitob', name: { UZ: 'Kitob tumani', RU: 'Китабский район', EN: 'Kitab District', QQ: 'Kitob rayonı' } },
              { id: 'koson', name: { UZ: 'Koson tumani', RU: 'Касанский район', EN: 'Koson District', QQ: 'Koson rayonı' } },
              { id: 'mirishkor', name: { UZ: 'Mirishkor tumani', RU: 'Миришкорский район', EN: 'Mirishkor District', QQ: 'Mirishkor rayonı' } },
              { id: 'muborak', name: { UZ: 'Muborak tumani', RU: 'Мубарекский район', EN: 'Mubarek District', QQ: 'Muborak rayonı' } },
              { id: 'nishon', name: { UZ: 'Nishon tumani', RU: 'Нишанский район', EN: 'Nishon District', QQ: 'Nishon rayonı' } },
              { id: 'qamashi', name: { UZ: 'Qamashi tumani', RU: 'Камашинский район', EN: 'Kamashi District', QQ: 'Qamashi rayonı' } },
              { id: 'qarshi_v', name: { UZ: 'Qarshi tumani', RU: 'Каршинский район', EN: 'Karshi District', QQ: 'Qarshi rayonı' } },
              { id: 'shaxrisabz_v', name: { UZ: 'Shahrisabz tumani', RU: 'Шахрисабзский район', EN: 'Shahrisabz District', QQ: 'Shaxrisabz rayonı' } },
              { id: 'yakkabog', name: { UZ: 'Yakkabogʻ tumani', RU: 'Яккабагский район', EN: 'Yakkabog District', QQ: 'Yakkabogʻ rayonı' } },
              { id: 'chirakchi', name: { UZ: 'Chiroqchi tumani', RU: 'Чиракчинский район', EN: 'Chirakchi District', QQ: 'Chiroqshi rayonı' } },
              { id: 'kokdala', name: { UZ: 'Koʻkdala tumani', RU: 'Кукдалинский район', EN: 'Kokdala District', QQ: 'Kókdala rayonı' } }
            ]
          },
          {
            id: 'navoiy',
            name: { UZ: 'Navoiy viloyati', RU: 'Навоийская область', EN: 'Navoiy Region', QQ: 'Navoiy wálayatı', UZ_KR: 'Навоий вилояти' },
            districts: [
              { id: 'navoiy_sh', name: { UZ: 'Navoiy shahri', RU: 'г. Навои', EN: 'Navoiy City', QQ: 'Navoiy qalası' } },
              { id: 'zarafshon', name: { UZ: 'Zarafshon shahri', RU: 'г. Зарафшан', EN: 'Zarafshan', QQ: 'Zarafshon qalası' } },
              { id: 'karmana', name: { UZ: 'Karmana tumani', RU: 'Карманинский район', EN: 'Karmana District', QQ: 'Karmana rayonı' } },
              { id: 'konimex', name: { UZ: 'Konimex tumani', RU: 'Канимехский район', EN: 'Kanimekh District', QQ: 'Konimex rayonı' } },
              { id: 'navbahor', name: { UZ: 'Navbahor tumani', RU: 'Навбахорский район', EN: 'Navbahor District', QQ: 'Navbahor rayonı' } },
              { id: 'nurota', name: { UZ: 'Nurota tumani', RU: 'Нуратинский район', EN: 'Nurata District', QQ: 'Nurota rayonı' } },
              { id: 'qiziltepa', name: { UZ: 'Qiziltepa tumani', RU: 'Кызылтепинский район', EN: 'Kiziltepa District', QQ: 'Qiziltepa rayonı' } },
              { id: 'tomdi', name: { UZ: 'Tomdi tumani', RU: 'Тамдынский район', EN: 'Tamdy District', QQ: 'Tomdi rayonı' } },
              { id: 'uchquduq', name: { UZ: 'Uchquduq tumani', RU: 'Учкудукский район', EN: 'Uchquduq District', QQ: 'Ushquduq rayonı' } },
              { id: 'xatirchi', name: { UZ: 'Xatirchi tumani', RU: 'Хатырчинский район', EN: 'Khatirchi District', QQ: 'Xatirshi rayonı' } }
            ]
          },
          {
            id: 'namangan',
            name: { UZ: 'Namangan viloyati', RU: 'Наманганская область', EN: 'Namangan Region', QQ: 'Namangan wálayatı', UZ_KR: 'Наманган вилояти' },
            districts: [
              { id: 'namangan_sh', name: { UZ: 'Namangan shahri', RU: 'г. Наманган', EN: 'Namangan City', QQ: 'Namangan qalası' } },
              { id: 'chortoq', name: { UZ: 'Chortoq tumani', RU: 'Чартакский район', EN: 'Chartak District', QQ: 'Chortoq rayonı' } },
              { id: 'chust', name: { UZ: 'Chust tumani', RU: 'Чустский район', EN: 'Chust District', QQ: 'Chust rayonı' } },
              { id: 'kosonsoy', name: { UZ: 'Kosonsoy tumani', RU: 'Касансайский район', EN: 'Kasansay District', QQ: 'Kosonsoy rayonı' } },
              { id: 'mingbuloq', name: { UZ: 'Mingbuloq tumani', RU: 'Мингбулакский район', EN: 'Mingbulak District', QQ: 'Mingbuloq rayonı' } },
              { id: 'namangan_v', name: { UZ: 'Namangan tumani', RU: 'Наманганский район', EN: 'Namangan District', QQ: 'Namangan rayonı' } },
              { id: 'norin', name: { UZ: 'Norin tumani', RU: 'Нарынский район', EN: 'Naryn District', QQ: 'Norin rayonı' } },
              { id: 'pop', name: { UZ: 'Pop tumani', RU: 'Папский район', EN: 'Pap District', QQ: 'Pop rayonı' } },
              { id: 'toraqorgon', name: { UZ: 'Toʻraqoʻrgʻon tumani', RU: 'Туракурганский район', EN: 'Turakurgan District', QQ: 'Toraqorǵon rayonı' } },
              { id: 'uchqoʻrgʻon', name: { UZ: 'Uchqoʻrgʻon tumani', RU: 'Учкурганский район', EN: 'Uchkurgan District', QQ: 'Ushqorǵon rayonı' } },
              { id: 'uichi', name: { UZ: 'Uychi tumani', RU: 'Уйчинский район', EN: 'Uychi District', QQ: 'Uyshi rayonı' } },
              { id: 'yangiqorgon', name: { UZ: 'Yangiqoʻrgʻon tumani', RU: 'Янгикурганский район', EN: 'Yangikurgan District', QQ: 'Yangiqorǵon rayonı' } }
            ]
          },
          {
            id: 'samarqand',
            name: { UZ: 'Samarqand viloyati', RU: 'Самаркандская область', EN: 'Samarkand Region', QQ: 'Samarqand wálayatı', UZ_KR: 'Самарқанд вилояти' },
            districts: [
              { id: 'samarqand_sh', name: { UZ: 'Samarqand shahri', RU: 'г. Самарканд', EN: 'Samarkand City', QQ: 'Samarqand qalası' } },
              { id: 'kattaqorgon_sh', name: { UZ: 'Kattaqoʻrgʻon shahri', RU: 'г. Каттакурган', EN: 'Kattakurgan City', QQ: 'Kattaqorǵon qalası' } },
              { id: 'bulungur', name: { UZ: 'Bulungʻur tumani', RU: 'Булунгурский район', EN: 'Bulungur District', QQ: 'Bulungur rayonı' } },
              { id: 'ishtixon', name: { UZ: 'Ishtixon tumani', RU: 'Иштыханский район', EN: 'Ishtikhan District', QQ: 'Ishtixon rayonı' } },
              { id: 'jomboy', name: { UZ: 'Jomboy tumani', RU: 'Джамбайский район', EN: 'Jombay District', QQ: 'Jomboy rayonı' } },
              { id: 'kattaqorgon_v', name: { UZ: 'Kattaqoʻrgʻon tumani', RU: 'Каттакурганский район', EN: 'Kattakurgan District', QQ: 'Kattaqorǵon rayonı' } },
              { id: 'narpay', name: { UZ: 'Narpay tumani', RU: 'Нарпайский район', EN: 'Narpay District', QQ: 'Narpay rayonı' } },
              { id: 'nurobod', name: { UZ: 'Nurobod tumani', RU: 'Нурабадский район', EN: 'Nurabad District', QQ: 'Nurobod rayonı' } },
              { id: 'oqdaryo', name: { UZ: 'Oqdaryo tumani', RU: 'Акдарьинский район', EN: 'Akdarya District', QQ: 'Oqdaryo rayonı' } },
              { id: 'paxtachi', name: { UZ: 'Paxtachi tumani', RU: 'Пахтачийский район', EN: 'Pakhtachi District', QQ: 'Paxtashi rayonı' } },
              { id: 'payariq', name: { UZ: 'Payariq tumani', RU: 'Пайарыкский район', EN: 'Payarik District', QQ: 'Payariq rayonı' } },
              { id: 'pastdargom', name: { UZ: 'Pastdargʻom tumani', RU: 'Пастдаргомский район', EN: 'Pastdargom District', QQ: 'Pastdargʻom rayonı' } },
              { id: 'samarqand_v', name: { UZ: 'Samarqand tumani', RU: 'Самаркандский район', EN: 'Samarkand District', QQ: 'Samarqand rayonı' } },
              { id: 'toyloq', name: { UZ: 'Toyloq tumani', RU: 'Тайлакский район', EN: 'Taylak District', QQ: 'Toyloq rayonı' } },
              { id: 'urgut', name: { UZ: 'Urgut tumani', RU: 'Ургутский район', EN: 'Urgut District', QQ: 'Urgut rayonı' } }
            ]
          },
          {
            id: 'sirdaryo',
            name: { UZ: 'Sirdaryo viloyati', RU: 'Сырдарьинская область', EN: 'Syrdarya Region', QQ: 'Sirdaryo wálayatı', UZ_KR: 'Сирдарё вилояти' },
            districts: [
              { id: 'guliston_sh', name: { UZ: 'Guliston shahri', RU: 'г. Гулистан', EN: 'Gulistan City', QQ: 'Guliston qalası' } },
              { id: 'shirin_sh', name: { UZ: 'Shirin shahri', RU: 'г. Ширин', EN: 'Shirin City', QQ: 'Shirin qalası' } },
              { id: 'yangiyer_sh', name: { UZ: 'Yangiyer shahri', RU: 'г. Янгиер', EN: 'Yangiyer City', QQ: 'Yangiyer qalası' } },
              { id: 'oqoltin', name: { UZ: 'Oqoltin tumani', RU: 'Акалтынский район', EN: 'Akaltin District', QQ: 'Oqoltin rayonı' } },
              { id: 'boyovut', name: { UZ: 'Boyovut tumani', RU: 'Баявутский район', EN: 'Bayavut District', QQ: 'Boyovut rayonı' } },
              { id: 'guliston_v', name: { UZ: 'Guliston tumani', RU: 'Гулистанский район', EN: 'Gulistan District', QQ: 'Guliston rayonı' } },
              { id: 'xovos', name: { UZ: 'Xovos tumani', RU: 'Хавастский район', EN: 'Khavast District', QQ: 'Xovos rayonı' } },
              { id: 'mirzaobod', name: { UZ: 'Mirzaobod tumani', RU: 'Мирзаабадский район', EN: 'Mirzaabad District', QQ: 'Mirzaobod rayonı' } },
              { id: 'sayxunobod', name: { UZ: 'Sayxunobod tumani', RU: 'Сайхунабадский район', EN: 'Saykhunabad District', QQ: 'Sayxunobod rayonı' } },
              { id: 'sardoba', name: { UZ: 'Sardoba tumani', RU: 'Сардобинский район', EN: 'Sardoba District', QQ: 'Sardoba rayonı' } },
              { id: 'sirdaryo_v', name: { UZ: 'Sirdaryo tumani', RU: 'Сырдарьинский район', EN: 'Syrdarya District', QQ: 'Sirdaryo rayonı' } }
            ]
          },
          {
            id: 'surxondaryo',
            name: { UZ: 'Surxondaryo viloyati', RU: 'Сурхандарьинская область', EN: 'Surkhandarya Region', QQ: 'Surxondaryo wálayatı', UZ_KR: 'Сурхондарё вилояти' },
            districts: [
              { id: 'termiz_sh', name: { UZ: 'Termiz shahri', RU: 'г. Термез', EN: 'Termez City', QQ: 'Termiz qalası' } },
              { id: 'angori', name: { UZ: 'Angor tumani', RU: 'Ангорский район', EN: 'Angor District', QQ: 'Angor rayonı' } },
              { id: 'boysun', name: { UZ: 'Boysun tumani', RU: 'Байсунский район', EN: 'Boysun District', QQ: 'Boysun rayonı' } },
              { id: 'denov', name: { UZ: 'Denov tumani', RU: 'Денауский район', EN: 'Denau District', QQ: 'Denov rayonı' } },
              { id: 'jarqorgon', name: { UZ: 'Jarqoʻrgʻon tumani', RU: 'Джаркурганский район', EN: 'Jarkurgan District', QQ: 'Jarqorǵon rayonı' } },
              { id: 'qiziriq', name: { UZ: 'Qiziriq tumani', RU: 'Кизирикский район', EN: 'Kizirik District', QQ: 'Qiziriq rayonı' } },
              { id: 'qumqorgon', name: { UZ: 'Qumqoʻrgʻon tumani', RU: 'Кумкурганский район', EN: 'Kumkurgan District', QQ: 'Qumqorǵon rayonı' } },
              { id: 'muzrabot', name: { UZ: 'Muzrabot tumani', RU: 'Музрабадский район', EN: 'Muzrabat District', QQ: 'Muzrabot rayonı' } },
              { id: 'oltinsoy', name: { UZ: 'Oltinsoy tumani', RU: 'Алтынсайский район', EN: 'Altinsoy District', QQ: 'Oltinsoy rayonı' } },
              { id: 'sariosiyo', name: { UZ: 'Sariosiyo tumani', RU: 'Сариасийский район', EN: 'Sariosiyo District', QQ: 'Sariosiyo rayonı' } },
              { id: 'sherobod', name: { UZ: 'Sherobod tumani', RU: 'Шерабадский район', EN: 'Sherabad District', QQ: 'Sherobod rayonı' } },
              { id: 'shorshi', name: { UZ: 'Shoʻrchi tumani', RU: 'Шурчинский район', EN: 'Shurchi District', QQ: 'Shorshi rayonı' } },
              { id: 'termiz_v', name: { UZ: 'Termiz tumani', RU: 'Термезский район', EN: 'Termez District', QQ: 'Termiz rayonı' } },
              { id: 'uzun', name: { UZ: 'Uzun tumani', RU: 'Узунский район', EN: 'Uzun District', QQ: 'Uzun rayonı' } }
            ]
          },
          {
            id: 'xorazm',
            name: { UZ: 'Xorazm viloyati', RU: 'Хорезмская область', EN: 'Khorezm Region', QQ: 'Xorezm wálayatı', UZ_KR: 'Хоразм вилояти' },
            districts: [
              { id: 'urganch_sh', name: { UZ: 'Urganch shahri', RU: 'г. Ургенч', EN: 'Urgench City', QQ: 'Urganch qalası' } },
              { id: 'xiva_sh', name: { UZ: 'Xiva shahri', RU: 'г. Хива', EN: 'Khiva City', QQ: 'Xiva qalası' } },
              { id: 'bogot', name: { UZ: 'Bogʻot tumani', RU: 'Багатский район', EN: 'Bagat District', QQ: 'Bogʻot rayonı' } },
              { id: 'gurlan', name: { UZ: 'Gurlan tumani', RU: 'Гурленский район', EN: 'Gurlan District', QQ: 'Gurlan rayonı' } },
              { id: 'xonqa', name: { UZ: 'Xonqa tumani', RU: 'Ханкинский район', EN: 'Khanka District', QQ: 'Xonqa rayonı' } },
              { id: 'hazorasp', name: { UZ: 'Hazorasp tumani', RU: 'Хазараспский район', EN: 'Khazarasp District', QQ: 'Hazorasp rayonı' } },
              { id: 'xiva_v', name: { UZ: 'Xiva tumani', RU: 'Хивинский район', EN: 'Khiva District', QQ: 'Xiva rayonı' } },
              { id: 'qoshkopir', name: { UZ: 'Qoʻshkoʻpir tumani', RU: 'Кошкупырский район', EN: 'Koshkupir District', QQ: 'Qoshkópir rayonı' } },
              { id: 'shovot', name: { UZ: 'Shovot tumani', RU: 'Шаватский район', EN: 'Shavat District', QQ: 'Shovot rayonı' } },
              { id: 'urganch_v', name: { UZ: 'Urganch tumani', RU: 'Ургенчский район', EN: 'Urgench District', QQ: 'Urganch rayonı' } },
              { id: 'yangiariq', name: { UZ: 'Yangiariq tumani', RU: 'Янгиарыкский район', EN: 'Yangiariq District', QQ: 'Yangiariq rayonı' } },
              { id: 'yangibozor', name: { UZ: 'Yangibozor tumani', RU: 'Янгибазарский район', EN: 'Yangibozor District', QQ: 'Yangibozor rayonı' } },
              { id: 'tuproqqala', name: { UZ: 'Tuproqqalʼa tumani', RU: 'Тупраккалинский район', EN: 'Tuprokkala District', QQ: 'Tuproqqala rayonı' } }
            ]
          },
          {
            id: 'fargona',
            name: { UZ: 'Fargʻona viloyati', RU: 'Ферганская область', EN: 'Fergana Region', QQ: 'Fargʻona wálayatı', UZ_KR: 'Фарғона вилояти' },
            districts: [
              { id: 'fargona_sh', name: { UZ: 'Fargʻona shahri', RU: 'г. Фергана', EN: 'Fergana City', QQ: 'Fargʻona qalası' } },
              { id: 'qoqon_sh', name: { UZ: 'Qoʻqon shahri', RU: 'г. Коканд', EN: 'Kokand City', QQ: 'Qoqon qalası' } },
              { id: 'margilon_sh', name: { UZ: 'Margʻilon shahri', RU: 'г. Маргилан', EN: 'Margilan City', QQ: 'Margʻilon qalası' } },
              { id: 'quvasoy_sh', name: { UZ: 'Quvasoy shahri', RU: 'г. Кувасай', EN: 'Kuvasay City', QQ: 'Quvasoy qalası' } },
              { id: 'oltariq', name: { UZ: 'Oltiariq tumani', RU: 'Алтыарыкский район', EN: 'Altiariq District', QQ: 'Oltiariq rayonı' } },
              { id: 'bagdod', name: { UZ: 'Bagʻdod tumani', RU: 'Багдадский район', EN: 'Baghdad District', QQ: 'Baǵdod rayonı' } },
              { id: 'beshariq', name: { UZ: 'Beshariq tumani', RU: 'Бешарыкский район', EN: 'Besharyk District', QQ: 'Beshariq rayonı' } },
              { id: 'buvayda', name: { UZ: 'Buvayda tumani', RU: 'Бувайдинский район', EN: 'Buvayda District', QQ: 'Buvayda rayonı' } },
              { id: 'dangara', name: { UZ: 'Dangʻara tumani', RU: 'Дангаринский район', EN: 'Dangara District', QQ: 'Dangʻara rayonı' } },
              { id: 'fargona_v', name: { UZ: 'Fargʻona tumani', RU: 'Ферганский район', EN: 'Fergana District', QQ: 'Fargʻona rayonı' } },
              { id: 'furqat', name: { UZ: 'Furqat tumani', RU: 'Фуркатский район', EN: 'Furqat District', QQ: 'Furqat rayonı' } },
              { id: 'qorgontepa_f', name: { UZ: 'Qoʻshtepa tumani', RU: 'Куштепинский район', EN: 'Kushtepa District', QQ: 'Qoshtepa rayonı' } },
              { id: 'quva', name: { UZ: 'Quva tumani', RU: 'Кувинский район', EN: 'Quva District', QQ: 'Quva rayonı' } },
              { id: 'rishton', name: { UZ: 'Rishton tumani', RU: 'Риштанский район', EN: 'Rishtan District', QQ: 'Rishton rayonı' } },
              { id: 'sox', name: { UZ: 'Soʻx tumani', RU: 'Сохский район', EN: 'Sokh District', QQ: 'Sox rayonı' } },
              { id: 'toshloq', name: { UZ: 'Toshloq tumani', RU: 'Ташлакский район', EN: 'Toshloq District', QQ: 'Toshloq rayonı' } },
              { id: 'uchkoprik', name: { UZ: 'Uchkuyrik tumani', RU: 'Учкуприкский район', EN: 'Uchkuprik District', QQ: 'Ushkópir rayonı' } },
              { id: 'ozbekiston', name: { UZ: 'Oʻzbekiston tumani', RU: 'Узбекистанский район', EN: 'Uzbekistan District', QQ: 'Ózbekistan rayonı' } },
              { id: 'yozvovon', name: { UZ: 'Yozyovon tumani', RU: 'Язъяванский район', EN: 'Yazyavan District', QQ: 'Yozvovon rayonı' } }
            ]
          },
          {
            id: 'qoraqalpogiston',
            name: { UZ: 'Qoraqalpogʻiston Respublikasi', RU: 'Республика Караakalpakstan', EN: 'Republic of Karakalpakstan', QQ: 'Qaraqalpaqstan Respublikası', UZ_KR: 'Қорақалпоғистон Республикаси' },
            districts: [
              { id: 'nukus_sh', name: { UZ: 'Nukus shahri', RU: 'г. Нукус', EN: 'Nukus City', QQ: 'Nukus qalası' } },
              { id: 'amudaryo', name: { UZ: 'Amudaryo tumani', RU: 'Амударьинский район', EN: 'Amudarya District', QQ: 'Ámiwdarya rayonı' } },
              { id: 'beruniy', name: { UZ: 'Beruniy tumani', RU: 'Берунийский район', EN: 'Beruniy District', QQ: 'Beruniy rayonı' } },
              { id: 'shimbay', name: { UZ: 'Chimboy tumani', RU: 'Чимбайский район', EN: 'Chimbay District', QQ: 'Shimbay rayonı' } },
              { id: 'ellikqala', name: { UZ: 'Ellikqalʼa tumani', RU: 'Элликкалинский район', EN: 'Ellikkala District', QQ: 'Ellikqala rayonı' } },
              { id: 'kegeyli', name: { UZ: 'Kegeyli tumani', RU: 'Кегейлийский район', EN: 'Kegeyli District', QQ: 'Kegeyli rayonı' } },
              { id: 'moynaq', name: { UZ: 'Moʻynoq tumani', RU: 'Муйнакский район', EN: 'Muynak District', QQ: 'Moynaq rayonı' } },
              { id: 'nukus_v', name: { UZ: 'Nukus tumani', RU: 'Нукусский район', EN: 'Nukus District', QQ: 'Nukus rayonı' } },
              { id: 'qonirat', name: { UZ: 'Qoʻngʻirot tumani', RU: 'Кунградский район', EN: 'Kungrad District', QQ: 'Qońırat rayonı' } },
              { id: 'qoraozak', name: { UZ: 'Qoraoʻzak tumani', RU: 'Караузякский район', EN: 'Karauzak District', QQ: 'Qaraózek rayonı' } },
              { id: 'shumanay', name: { UZ: 'Shumanay tumani', RU: 'Шуманайский район', EN: 'Shumanay District', QQ: 'Shomanay rayonı' } },
              { id: 'taxtakopir', name: { UZ: 'Taxtakoʻpir tumani', RU: 'Тахтакупырский район', EN: 'Takhtakupir District', QQ: 'Taxtakópir rayonı' } },
              { id: 'tortkul', name: { UZ: 'Toʻrtkoʻl tumani', RU: 'Турткульский район', EN: 'Turtkul District', QQ: 'Tórtkul rayonı' } },
              { id: 'xojeli', name: { UZ: 'Xoʻjayli tumani', RU: 'Ходжейлийский район', EN: 'Khojayli District', QQ: 'Xojeli rayonı' } },
              { id: 'taxiatosh', name: { UZ: 'Taxiatosh tumani', RU: 'Тахиаташский район', EN: 'Takhiatash District', QQ: 'Taxiatosh rayonı' } },
              { id: 'bozatov', name: { UZ: 'Boʻzatov tumani', RU: 'Бозатауский район', EN: 'Bozatov District', QQ: 'Bozataw rayonı' } }
            ]
          }
        ]
      },
      {
        id: 'kz',
        name: { UZ: 'Qozogʻiston', RU: 'Казахстан', EN: 'Kazakhstan', QQ: 'Qazaqstan' },
        regions: [
          {
            id: 'almaty_reg',
            name: { UZ: 'Olmaota viloyati', RU: 'Алматинская область', EN: 'Almaty Region', QQ: 'Almatı wálayatı' },
            districts: [
              { id: 'talgar', name: { UZ: 'Talgar', RU: 'Талгар', EN: 'Talgar', QQ: 'Talgar' } },
              { id: 'enbekshikazakh', name: { UZ: 'Enbekshiqozoq', RU: 'Енбекшиказахский', EN: 'Enbekshikazakh' } },
              { id: 'karasay', name: { UZ: 'Qorasoy', RU: 'Карасайский', EN: 'Karasay' } }
            ]
          },
          {
            id: 'astana',
            name: { UZ: 'Ostona shahri', RU: 'г. Астана', EN: 'Astana City', QQ: 'Astana qalası' },
            districts: [
              { id: 'almaty_dist', name: { UZ: 'Almati tumani', RU: 'Алматинский район', EN: 'Almaty District' } },
              { id: 'esil', name: { UZ: 'Yesil tumani', RU: 'Есильский район', EN: 'Esil District' } }
            ]
          },
          {
            id: 'turkistan',
            name: { UZ: 'Turkiston viloyati', RU: 'Туркестанская область', EN: 'Turkistan Region', QQ: 'Turkistan wálayatı' },
            districts: [
              { id: 'saryagash', name: { UZ: 'Sariogʻoch', RU: 'Сарыагашский', EN: 'Saryagash' } },
              { id: 'jetisay', name: { UZ: 'Jetisoy', RU: 'Жетысайский', EN: 'Jetisay' } }
            ]
          }
        ]
      },
      {
        id: 'kg',
        name: { UZ: 'Qirgʻiziston', RU: 'Кыргызстан', EN: 'Kyrgyzstan', QQ: 'Qırǵızstan' },
        regions: [
          {
            id: 'osh_reg',
            name: { UZ: 'Oʻsh viloyati', RU: 'Ошская область', EN: 'Osh Region', QQ: 'Osh wálayatı' },
            districts: [
              { id: 'karasuu', name: { UZ: 'Qorasuv', RU: 'Кара-Суу', EN: 'Kara-Suu', QQ: 'Qarasuw' } },
              { id: 'aravan', name: { UZ: 'Aravon', RU: 'Араванский', EN: 'Aravan' } }
            ]
          },
          {
            id: 'bishkek',
            name: { UZ: 'Bishkek shahri', RU: 'г. Бишкек', EN: 'Bishkek City', QQ: 'Bishkek qalası' },
            districts: [
              { id: 'lenin', name: { UZ: 'Lenin tumani', RU: 'Ленинский район', EN: 'Lenin District' } },
              { id: 'oktyabr', name: { UZ: 'Oktyabr tumani', RU: 'Октябрьский район', EN: 'Oktyabr District' } }
            ]
          },
          {
            id: 'jalalabad',
            name: { UZ: 'Jalolobod viloyati', RU: 'Джалал-Абадская область', EN: 'Jalal-Abad Region', QQ: 'Jalal-Abad wálayatı' },
            districts: [
              { id: 'suzakh', name: { UZ: 'Suzoq', RU: 'Сузакский', EN: 'Suzak' } },
              { id: 'ala_buka', name: { UZ: 'Ola-Buqa', RU: 'Ала-Букинский', EN: 'Ala-Buka' } }
            ]
          }
        ]
      },
      {
        id: 'tj',
        name: { UZ: 'Tojikiston', RU: 'Таджикистан', EN: 'Tajikistan', QQ: 'Tájikistan' },
        regions: [
          {
            id: 'sughd',
            name: { UZ: 'Sugʻd viloyati', RU: 'Согдийская область', EN: 'Sughd Region', QQ: 'Sugʻd wálayatı' },
            districts: [
              { id: 'khujand', name: { UZ: 'Xoʻjand', RU: 'Худжанд', EN: 'Khujand', QQ: 'Xojand' } },
              { id: 'bobojon_gafurov', name: { UZ: 'Bobojon Gʻafurov', RU: 'Б. Гафуровский', EN: 'Bobojon Gafurov' } },
              { id: 'panjakent', name: { UZ: 'Panjakent', RU: 'Пенджикент', EN: 'Panjakent' } }
            ]
          },
          {
            id: 'dushanbe',
            name: { UZ: 'Dushanbe shahri', RU: 'г. Душанбе', EN: 'Dushanbe City', QQ: 'Dushanbe qalası' },
            districts: [
              { id: 'isimoil_somoni', name: { UZ: 'Ismoil Somoni', RU: 'И. Сомони', EN: 'Ismoil Somoni' } },
              { id: 'firdavsi', name: { UZ: 'Firdavsiy', RU: 'Фирдавси', EN: 'Firdavsi' } }
            ]
          },
          {
            id: 'khatlon',
            name: { UZ: 'Xatlon viloyati', RU: 'Хатлонская область', EN: 'Khatlon Region', QQ: 'Xatlon wálayatı' },
            districts: [
              { id: 'bokhtar', name: { UZ: 'Boxtar', RU: 'Бохтар', EN: 'Bokhtar' } },
              { id: 'kulob', name: { UZ: 'Koʻlob', RU: 'Куляб', EN: 'Kulob' } }
            ]
          }
        ]
      },
      {
        id: 'tm',
        name: { UZ: 'Turkmaniston', RU: 'Туркменистан', EN: 'Turkmenistan', QQ: 'Túrkmenistan' },
        regions: [
          {
            id: 'mary',
            name: { UZ: 'Mari viloyati', RU: 'Марыйский велаят', EN: 'Mary Region', QQ: 'Mari wálayatı' },
            districts: [
              { id: 'mary_dist', name: { UZ: 'Mari tumani', RU: 'Марыйский район', EN: 'Mary District', QQ: 'Mari rayonı' } },
              { id: 'bayramaly', name: { UZ: 'Bayramali', RU: 'Байрамали', EN: 'Bayramaly' } }
            ]
          },
          {
            id: 'ashgabat',
            name: { UZ: 'Ashxobod shahri', RU: 'г. Ашхабад', EN: 'Ashgabat City', QQ: 'Ashxobod qalası' },
            districts: [
              { id: 'berkararlyk', name: { UZ: 'Berkararlik', RU: 'Беркарарлык', EN: 'Berkararlyk' } },
              { id: 'bagtyyarlyk', name: { UZ: 'Bagtiyarlik', RU: 'Багтыярлык', EN: 'Bagtyyarlyk' } }
            ]
          },
          {
            id: 'lebab',
            name: { UZ: 'Labap viloyati', RU: 'Лебапский велаят', EN: 'Lebab Region', QQ: 'Lebab wálayatı' },
            districts: [
              { id: 'turkmenabat', name: { UZ: 'Turkmanobod', RU: 'Туркменабад', EN: 'Turkmenabat' } },
              { id: 'farap', name: { UZ: 'Farap', RU: 'Фарап', EN: 'Farap' } }
            ]
          }
        ]
      },
      {
        id: 'other',
        name: { UZ: 'Boshqa', RU: 'Другое', EN: 'Other', QQ: 'Basqa', UZ_KR: 'Бошқа' },
        regions: []
      }
    ]
  };

  getCountries() {
    return this.data.countries;
  }
}
