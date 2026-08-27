import {
  ArrowLeftRight,
  Award,
  BadgeCheck,
  Barcode,
  BarChart3,
  Boxes,
  Building2,
  CalendarX,
  ClipboardList,
  FilePlus,
  FileText,
  Layers,
  LayoutGrid,
  ListTree,
  Monitor,
  Package,
  QrCode,
  Ruler,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  TrendingDown,
  Truck,
  Undo2,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react'

export const NAV_SECTIONS = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, to: '/' },
      {
        id: 'super-admin',
        label: 'Super Admin',
        icon: ShieldCheck,
        children: [
          { id: 'admin-dashboard', label: 'Dashboard', to: '/admin/dashboard' },
          { id: 'companies', label: 'Companies', to: '/admin/companies' },
          { id: 'subscriptions', label: 'Subscriptions', to: '/admin/subscriptions' },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    items: [
      { id: 'products', label: 'Products', icon: Package, to: '/inventory/products' },
      { id: 'create-product', label: 'Create Product', icon: FilePlus, to: '/inventory/products/new' },
      { id: 'expired-products', label: 'Expired Products', icon: CalendarX, to: '/inventory/expired' },
      { id: 'low-stocks', label: 'Low Stocks', icon: TrendingDown, to: '/inventory/low-stock' },
      { id: 'category', label: 'Category', icon: Layers, to: '/inventory/categories' },
      { id: 'sub-category', label: 'Sub Category', icon: ListTree, to: '/inventory/sub-categories' },
      { id: 'brands', label: 'Brands', icon: Award, to: '/inventory/brands' },
      { id: 'units', label: 'Units', icon: Ruler, to: '/inventory/units' },
      { id: 'variant-attributes', label: 'Variant Attributes', icon: SlidersHorizontal, to: '/inventory/variants' },
      { id: 'warranties', label: 'Warranties', icon: BadgeCheck, to: '/inventory/warranties' },
      { id: 'print-barcode', label: 'Print Barcode', icon: Barcode, to: '/inventory/barcode' },
      { id: 'print-qr', label: 'Print QR Code', icon: QrCode, to: '/inventory/qr-code' },
    ],
  },
  {
    id: 'stock',
    title: 'Stock',
    items: [
      { id: 'manage-stock', label: 'Manage Stock', icon: Boxes, to: '/stock' },
      { id: 'stock-adjustment', label: 'Stock Adjustment', icon: Scale, to: '/stock/adjustment' },
      { id: 'stock-transfer', label: 'Stock Transfer', icon: ArrowLeftRight, to: '/stock/transfer' },
    ],
  },
  {
    id: 'sales',
    title: 'Sales',
    items: [
      {
        id: 'sales',
        label: 'Sales',
        icon: ShoppingBag,
        children: [
          { id: 'sales-list', label: 'Sales List', to: '/sales' },
          { id: 'sales-details', label: 'Sales Details', to: '/sales/details' },
        ],
      },
      { id: 'invoices', label: 'Invoices', icon: FileText, to: '/sales/invoices' },
      { id: 'sales-return', label: 'Sales Return', icon: Undo2, to: '/sales/returns' },
      { id: 'quotation', label: 'Quotation', icon: ClipboardList, to: '/sales/quotation' },
      {
        id: 'pos',
        label: 'POS',
        icon: Monitor,
        children: [
          { id: 'pos-terminal', label: 'Terminal', to: '/pos' },
          { id: 'pos-orders', label: 'Orders', to: '/pos/orders' },
        ],
      },
    ],
  },
  {
    id: 'purchases',
    title: 'Purchases',
    items: [
      { id: 'purchase-list', label: 'Purchases', icon: ShoppingCart, to: '/purchases' },
      { id: 'purchase-order', label: 'Purchase Order', icon: FileText, to: '/purchases/orders' },
      { id: 'expenses', label: 'Expenses', icon: Wallet, to: '/purchases/expenses' },
    ],
  },
  {
    id: 'people',
    title: 'People',
    items: [
      { id: 'customers', label: 'Customers', icon: Users, to: '/people/customers' },
      { id: 'suppliers', label: 'Suppliers', icon: Truck, to: '/people/suppliers' },
      { id: 'stores', label: 'Stores', icon: Building2, to: '/people/stores' },
      { id: 'users', label: 'Users', icon: UserCog, to: '/people/users' },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      { id: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
      { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
    ],
  },
]

export const NAV_ROUTES = NAV_SECTIONS.flatMap((section) =>
  section.items.flatMap((item) =>
    item.children
      ? item.children.map((child) => ({ ...child, section: section.title, parent: item.label }))
      : [{ ...item, section: section.title }],
  ),
)
