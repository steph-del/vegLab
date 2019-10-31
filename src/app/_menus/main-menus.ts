export const wsPhytoMenu = [
  { label: 'Créer', children: [
    { label: 'Un relevé', path: '/phyto/app/create-occurrence' },
    { label: 'Un tableau', path: '/phyto/app/create-table'}]
  }, {
    label: 'Importer', children: [
      {label: 'Un relevé', path: '/phyto/app/import-occurrence' },
      { label: 'Un tableau', path: '/phyto/app/import-table' }
    ]
  },
  { label: 'Rechercher', children: [
    { label: 'Un relevé', path: '/phyto/app/search-occurrence' },
    { label: 'Un tableau', path: '/phyto/app/search-table' }
  ]}
];

export const adminMenu = [
  { label: 'Gérer', children: [
    { label: 'Les métadonnées', path: '/admin/metadata-manager'}
  ]}
];
