import {
  PiHouseLine,
  PiChartBar,
  PiTable,
  PiUserCircle,
  PiShieldCheck,
  PiUserPlus,
  PiGear,
  PiShoppingCart,
  PiUsers,
  PiFolder,
  PiFileText,
  PiChartLine,
  PiPackage,
  PiStorefront,
  PiListNumbers,
  PiCheckCircle,
  PiUserMinus,
  PiClock,
} from 'react-icons/pi';

// İkon eşleştirme map'i
export const iconMap: Record<string, React.ReactElement> = {
  PiHouseLine: <PiHouseLine />,
  PiChartBar: <PiChartBar />,
  PiTable: <PiTable />,
  PiUserCircle: <PiUserCircle />,
  PiShieldCheck: <PiShieldCheck />,
  PiUserPlus: <PiUserPlus />,
  PiGear: <PiGear />,
  PiShoppingCart: <PiShoppingCart />,
  PiUsers: <PiUsers />,
  PiFolder: <PiFolder />,
  PiFileText: <PiFileText />,
  PiChartLine: <PiChartLine />,
  PiPackage: <PiPackage />,
  PiStorefront: <PiStorefront />,
  // Yeni eklenen ikonlar
  PiListNumbers: <PiListNumbers />, // Numara Listesi
  PiCheckCircle: <PiCheckCircle />, // Tamamlanan
  PiUserMinus: <PiUserMinus />, // Hesap Yok
  PiClock: <PiClock />, // Bekleyen
};

// Varsayılan ikon
export const defaultIcon = <PiFolder />;

// İkon adından ikon elementi döndür
export function getIconByName(iconName?: string): React.ReactElement {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
}


