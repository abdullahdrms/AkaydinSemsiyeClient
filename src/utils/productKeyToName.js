export const productKeyToName = (name) => {
    switch (name) {
        case 'shapeSizeType':
            return 'Şekil Türü';
        case 'shape':
            return 'Şekil';
        case 'flue':
            return 'Baca';
        case 'skeletonChartId':
            return 'İskelet Rengi';
        case 'fabric':
            return 'Kumaş';
        case 'standType':
            return 'Ayak Tipi';
        case 'fringe':
            return 'Saçak';
        case 'led':
            return 'Led';
        case 'qty':
            return 'Sipariş Adeti';
        case 'price':
            return 'Sipariş Fiyatı';
        case 'taxType':
            return 'Kdv Oranı';
        case 'heater':
            return 'Isıtıcı';
        case 'electric':
            return 'Elektrik';
        case 'engine':
            return 'Motor';
        case 'acrylicColor':
            return 'Akrilik Renk';
        case 'localColor':
            return 'Lokal Renk';
        case 'fabricText':
            return 'Kumaş Rengi Açıklaması';
        case 'marbleStatus':
            return 'Mermer Durumu';
        case 'marbleType':
            return 'Mermer Türü';
        case 'print':
            return 'Baskı';
        case 'velcro':
            return 'Cırt';
        case 'printText':
            return 'Baskı Açıklaması';
        case 'printCornerCount':
            return 'Baskı Köşe Sayısı';
        case 'velcroCornerCount':
            return 'Cırt Köşe Sayısı';
        case 'ledType':
            return 'Led Türü';
        case 'ledQty':
            return 'Led Adeti';
        case 'ledText':
            return 'Led Açıklaması';
        case 'heaterQty':
            return 'Isıtıcı Adet';
        case 'electricText':
            return 'Elektrik Açıklaması';
        case 'engineType':
            return 'Motor Türü';
        case 'engineText':
            return 'Motor Türü Açıklaması';
        case 'curtain':
            return 'Perde';
        case 'curtainQty':
            return 'Perde Adeti';
        case 'curtainText':
            return 'Perde Açıklaması';
        case 'process':
            return 'Yapılacak İşlem';
        case 'body':
            return 'Gövde';
        default:
            return name;
    }
}