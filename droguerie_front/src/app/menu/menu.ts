import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Dashboard',
    translate: 'MENU.HOME',
    role: ['manager', 'admin'],
    type: 'item',
    icon: 'home',
    url: 'dashboard'
  }, 
  {
    id: 'user',
    title: 'Utilisateurs',
    translate: 'MENU.USER.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'user-check',
    role: ['admin'], 
    children: [
      {
        id: 'list_users',
        title: 'Tous utilisateurs',
        translate: 'MENU.USER.LIST',
        type: 'item',
        icon: 'circle',
        url: 'users/list'
      },
      {
        id: 'add_user',
        title: 'Ajouter utilisateur',
        translate: 'MENU.USER.ADD',
        type: 'item',
        icon: 'circle',
        url: 'users/add'
      }
    ]
  },
  {
    id: 'employer',
    title: 'Employeés',
    translate: 'MENU.EMPLOYER',
    role: ['admin'], 
    type: 'item',
    icon: 'user',
    url: 'employers/list'
  },
  {
    id: 'business_partners',
    title: 'Nos Partenaires',
    translate: 'MENU.BUSINESS_PARTNERS.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'users',
    role: ['admin'], 
    children: [
      {
        id: 'client',
        title: 'Clients',
        translate: 'MENU.BUSINESS_PARTNERS.CLIENT',
        type: 'item',
        icon: 'user-plus',
        url: 'clients/list'
      },
      {
        id: 'fournisseur',
        title: 'Fournisseurs',
        translate: 'MENU.BUSINESS_PARTNERS.FOURNISSEUR',
        type: 'item',
        icon: 'user-plus',
        url: 'fournisseurs/list'
      }
    ]
  }, 
  {
    id: 'product',
    title: 'Produits',
    translate: 'MENU.PRODUCT.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'shopping-bag',
    role: ['manager', 'admin'], 
    children: [
      {
        id: 'list_products',
        title: 'Liste produits',
        translate: 'MENU.PRODUCT.LIST',
        type: 'item',
        icon: 'circle',
        url: 'products/list'
      },
      {
        id: 'add_product',
        title: 'Ajouter produit',
        translate: 'MENU.PRODUCT.ADD',
        type: 'item',
        icon: 'circle',
        url: 'products/add'
      },
      {
        id: 'category',
        title: 'Catégories',
        translate: 'MENU.PRODUCT.CATEGORY',
        type: 'item',
        icon: 'square',
        url: 'categories/list'
      }
    ]
  },
  {
    id: 'service',
    title: 'Services',
    translate: 'MENU.SERVICE',
    role: ['manager', 'admin'], 
    type: 'item',
    icon: 'clipboard',
    url: 'services/list'
  },
  {
    id: 'quote',
    title: 'Devis',
    translate: 'MENU.QUOTE.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'file',
    role: ['manager', 'admin'], 
    children: [
      {
        id: 'quotes_list',
        title: 'Liste devis',
        translate: 'MENU.QUOTE.LIST',
        type: 'item',
        icon: 'circle',
        url: 'transactions/quote/list',
        
      },
      {
        id: 'add_quote',
        title: 'Ajouter devis',
        translate: 'MENU.QUOTE.ADD',
        type: 'item',
        icon: 'circle',
        url: 'transactions/quote/add',
        
      }
    ]
  },
  {
    id: 'simple_sale',
    title: 'Vente simple',
    translate: 'MENU.QUOTE.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'file',
    role: ['manager', 'admin'], 
    children: [
      {
        id: 'simple_sales_list',
        title: 'Liste des ventes',
        translate: 'MENU.SIMPLE_SALE.LIST',
        type: 'item',
        icon: 'circle',
        url: 'transactions/simple_sale/list',
        
      },
      {
        id: 'add_simple_sale',
        title: 'Ajouter vente',
        translate: 'MENU.SIMPLE_SALE.ADD',
        type: 'item',
        icon: 'circle',
        url: 'transactions/simple_sale/add',
        
      }
    ]
  },
  {
    id: 'sale',
    title: 'Vente',
    translate: 'MENU.SALE.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'file-plus',
    role: ['manager', 'admin'], 
    children: [
      {
        id: 'sales_list',
        title: 'Liste des ventes',
        translate: 'MENU.SALE.LIST',
        type: 'item',
        icon: 'circle',
        url: 'transactions/sale/list',
        
      },
      {
        id: 'add_sale',
        title: 'Ajouter vente',
        translate: 'MENU.SALE.ADD',
        type: 'item',
        icon: 'circle',
        url: 'transactions/sale/add',
        
      }
    ]
  },
  {
    id: 'purchase',
    title: 'Achat',
    translate: 'MENU.QUOTE.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'file-plus',
    role: ['manager', 'admin'], 
    children: [
      {
        id: 'purchases_list',
        title: 'Liste Achats',
        translate: 'MENU.PURCHASE.LIST',
        type: 'item',
        icon: 'circle',
        url: 'transactions/purchase/list',
        
      },
      {
        id: 'add_purchase',
        title: 'Ajouter achat',
        translate: 'MENU.PURCHASE.ADD',
        type: 'item',
        icon: 'circle',
        url: 'transactions/purchase/add',
        
      }
    ]
  },
  {
    id: 'invoice',
    title: 'Factures',
    translate: 'MENU.INVOICE.COLLAPSIBLE',
    role: ['admin'], 
    type: 'collapsible',
    icon: 'file-text',
    children: [
      {
        id: 'invoice-list-client',
        title: 'Factures - Clients',
        translate: 'MENU.INVOICE.LIST_CLIENT',
        type: 'item',
        icon: 'circle',
        url: 'transactions/invoice/list/out',
        
      },
      {
        id: 'invoice-list-fournisseur',
        title: 'Factures - Fournisseurs',
        translate: 'MENU.INVOICE.LIST_FOURNISSEUR',
        type: 'item',
        icon: 'circle',
        url: 'transactions/invoice/list/in',
        
      }
    ]
  },
  {
    id: 'cheque',
    title: 'Chéque',
    translate: 'MENU.CHEQUE.COLLAPSIBLE',
    role: ['admin'], 
    type: 'collapsible',
    icon: 'credit-card',
    children: [
      {
        id: 'cheque-list-client',
        title: 'Chéques - Clients',
        translate: 'MENU.CHEQUE.LIST_CLIENT',
        type: 'item',
        icon: 'circle',
        url: 'payment/cheques/list/out',
       
      },
      {
        id: 'cheque-list-fournisseur',
        title: 'Chéques - Fournisseurs',
        translate: 'MENU.CHEQUE.LIST_FOURNISSEUR',
        type: 'item',
        icon: 'circle',
        url: 'payment/cheques/list/in',
       
      }
    ]
  },
  {
    id: 'credit',
    title: 'Crédits',
    translate: 'MENU.CREDIT.COLLAPSIBLE',
    role: ['admin'], 
    type: 'collapsible',
    icon: 'rotate-cw',
    children: [
      {
        id: 'credit-list-client',
        title: 'Crédits - Clients',
        translate: 'MENU.CREDIT.LIST_CLIENT',
        type: 'item',
        icon: 'circle',
        url: 'payment/credits/list/out',
       
      },
      {
        id: 'credit-list-fournisseur',
        title: 'Crédits - Fournisseurs',
        translate: 'MENU.CREDIT.LIST_FOURNISSEUR',
        type: 'item',
        icon: 'circle',
        url: 'payment/credits/list/in',
       
      }
    ]
  },
  {
    id: 'cash',
    title: 'Cash',
    translate: 'MENU.CASH.COLLAPSIBLE',
    role: ['admin'], 
    type: 'collapsible',
    icon: 'dollar-sign',
    children: [
      {
        id: 'cash-list-client',
        title: 'Cashes - Clients',
        translate: 'MENU.CASH.LIST_CLIENT',
        type: 'item',
        icon: 'circle',
        url: 'payment/cahes/list/out',
      
      },
      {
        id: 'cash-list-fournisseur',
        title: 'Cashes - Fournisseurs',
        translate: 'MENU.CASH.LIST_FOURNISSEUR',
        type: 'item',
        icon: 'circle',
        url: 'payment/cahes/list/in',
      
      }
    ]
  },
  {
    id: 'traite',
    title: 'Traites',
    translate: 'MENU.TRAITE.COLLAPSIBLE',
    role: ['admin'], 
    type: 'collapsible',
    icon: 'archive',
    children: [
      {
        id: 'traite-list-client',
        title: 'Traites - Clients',
        translate: 'MENU.TRAITE.LIST_CLIENT',
        type: 'item',
        icon: 'circle',
        url: 'payment/traites/list/out',
   
      },
      {
        id: 'traite-list-fournisseur',
        title: 'Traites - Fournisseurs',
        translate: 'MENU.TRAITE.LIST_FOURNISSEUR',
        type: 'item',
        icon: 'circle',
        url: 'payment/traites/list/in',
      
      }
    ]
  }
  
]


