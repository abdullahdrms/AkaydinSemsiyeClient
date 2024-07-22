import { useParams } from 'react-router';
import KamelyaProduct from './otherProducts/kamelya-product';
import LuxuryProduct from './otherProducts/luxury-product';
import EcoProduct from './otherProducts/eco-product';
import SidePoloProduct from './otherProducts/sidePolo-product';
import ClasicProduct from './otherProducts/clasic-product';
import SparePartsProduct from './otherProducts/spareParts-product';
import WoodenProduct from './otherProducts/wooden-product';
import BeachProduct from './otherProducts/beach-product';
import Breadcrumbs from 'components/@extended/Breadcrumbs'

export default function CreateProduct() {
  const params = useParams()
  const orderId = location.pathname.replace('/orders/detail/create-product/', '').split('/')[0]
  if (parseInt(params.id) === 2) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Kamelya', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <KamelyaProduct />
      </>
    );
  } else if (parseInt(params.id) === 3) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Mekanizmalı Lüks Şemsiye', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <LuxuryProduct />
      </>
    )
  } else if (parseInt(params.id) === 4) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Mekanizmalı Ekonomik Şemsiye', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <EcoProduct />
      </>
    )
  } else if (parseInt(params.id) === 5) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Yandan Gövdeli Şemsiye', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <SidePoloProduct />
      </>
    )
  } else if (parseInt(params.id) === 1) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Klasik Şemsiye', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <ClasicProduct />
      </>
    )
  } else if (parseInt(params.id) === 6) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Yedek Parça ve Servis', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <SparePartsProduct />
      </>
    )
  } else if (parseInt(params.id) === 7) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Ahşap Şemsiye', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <WoodenProduct />
      </>
    )
  } else if (parseInt(params.id) === 8) {
    let breadcrumbLinks = [{ title: 'Sipariş Yönetimi', to: '/orders/list' }, { title: 'Detay', to: `/orders/detail/${orderId}` }, { title: 'Ürün Ekle', to: `/orders/detail/select-product/${orderId}` }, { title: 'Plaj Şemsiyesi', }]
    return (
      <>
        <Breadcrumbs custom links={breadcrumbLinks} />
        <BeachProduct />
      </>
    )
  }


}
