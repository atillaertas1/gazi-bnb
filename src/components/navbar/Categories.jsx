import React from 'react';
import Container from '../Container';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import CategoryBox from '../CategoryBox';
import { useLocation, useSearchParams } from 'react-router-dom';

export const categories = [
  {
    label: 'Plaj',
    icon: TbBeach,
    description: 'Bu mülk plaja yakın!',
  },
  {
    label: 'Yel Değirmenleri',
    icon: GiWindmill,
    description: 'Bu mülkte yel değirmenleri var!',
  },
  {
    label: 'Modern',
    icon: MdOutlineVilla,
    description: 'Bu mülk modern!',
  },
  {
    label: 'Kırsal Bölge',
    icon: TbMountain,
    description: 'Bu mülk kırsal bölgede!',
  },
  {
    label: 'Havuzlar',
    icon: TbPool,
    description: 'Bu mülkte havuz var!',
  },
  {
    label: 'Adalar',
    icon: GiIsland,
    description: 'Bu mülk bir adada!',
  },
  {
    label: 'Göl',
    icon: GiBoatFishing,
    description: 'Bu mülk göle yakın!',
  },
  {
    label: 'Kayak',
    icon: FaSkiing,
    description: 'Bu mülkte kayak aktiviteleri var!',
  },
  {
    label: 'Kaleler',
    icon: GiCastle,
    description: 'Bu mülk bir kalede!',
  },
  {
    label: 'Kamp',
    icon: GiForestCamp,
    description: 'Bu mülkte kamp aktiviteleri var!',
  },
  {
    label: 'Arktik',
    icon: BsSnow,
    description: 'Bu mülk Arktik bölgesinde!',
  },
  {
    label: 'Mağara',
    icon: GiCaveEntrance,
    description: 'Bu mülk bir mağarada!',
  },
  {
    label: 'Çöl',
    icon: GiCactus,
    description: 'Bu mülk çölde!',
  },
  {
    label: 'Ahırlar',
    icon: GiBarn,
    description: 'Bu mülk ahırlarda!',
  },
  {
    label: 'Lüks',
    icon: IoDiamond,
    description: 'Bu mülk lüks!',
  },
];

function Categories() {
  const [params] = useSearchParams();
  const category = params.get('category');
  const location = useLocation();
  const pathName = location.pathname;

  const isMainPage = pathName === '/';

  if (!isMainPage) {
    return null;
  }
  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
}

export default Categories;
