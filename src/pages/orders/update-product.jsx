import { useParams } from 'react-router';
import FormProductCreate from 'sections/facilities/FormProductCreate';
import KamelyaProduct from './otherProducts/kamelya-product';
import LuxuryProduct from './otherProducts/luxury-product';
import EcoProduct from './otherProducts/eco-product';
import SidePoloProduct from './otherProducts/sidePolo-product';
import ClasicProduct from './otherProducts/clasic-product';
import SparePartsProduct from './otherProducts/spareParts-product';
import WoodenProduct from './otherProducts/wooden-product';
import BeachProduct from './otherProducts/beach-product';

export default function UpdateProduct() {
  const params = useParams()
  const orderId = location.pathname.replace('/orders/detail/update-product/', '').split('/')[0]
  if (parseInt(params.id) === 1) {
    return (
      <>
        <KamelyaProduct update={true} />
      </>
    );
  } else if (parseInt(params.id) === 2) {
    return (
      <>
        <LuxuryProduct update={true} />
      </>
    )
  } else if (parseInt(params.id) === 3) {
    return (
      <>
        <EcoProduct update={true} />
      </>
    )
  } else if (parseInt(params.id) === 4) {
    return (
      <>
        <SidePoloProduct update={true} />
      </>
    )
  } else if (parseInt(params.id) === 5) {
    return (
      <>
        <ClasicProduct update={true} />
      </>
    )
  } else if (parseInt(params.id) === 6) {
    return (
      <>
        <SparePartsProduct update={true} />
      </>
    )
  } else if (parseInt(params.id) === 7) {
    return (
      <>
        <WoodenProduct update={true} />
      </>
    )
  } else if (parseInt(params.id) === 8) {
    return (
      <>
        <BeachProduct update={true} />
      </>
    )
  }


}
