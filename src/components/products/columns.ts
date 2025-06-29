import { ColumnDef } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { h } from 'vue'

import ImageFile from '../imageFile.vue'
import ProductRowActionButtons from './productRowActionButtons.vue'

export interface Product {
    id: number,
    sku: string,
    name: string,
    description: string,
    files: any[],
    images: any[]
}

export const columns: ColumnDef<Product>[] = [
  {
    id: 'image',
    header: '',
    cell: ({row}) => {
      let product = row.original
      let primaryImage = undefined
      if (product.images.length > 0)
        primaryImage = row.original.files[row.original.files.findIndex(f => product.images[0].fileId == f.id)]
      return h(ImageFile, { class: 'size-32', file: primaryImage})
    }
  },
  {
    id: 'sku',
    accessorKey: 'sku',
    header: 'Артикул',
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Название',
    cell: ({ row }) => {
      return h('p', { class: ' min-w-96 whitespace-break-spaces break-all' }, row.getValue('name'))
    }
  },
  {
    id: 'OZON',
    header: 'OZON',
    size: 100,
    cell: ({ row }) => {
      return h('div', h(X, { class: 'size-4 ' }))
    }
  },
  {
    id: 'Wildberries',
    header: 'Wildberries',
    size: 100,
    cell: ({ row }) => {
      return h('div', h(X, { class: 'size-4' }))
    }
  },
  {
    id: 'Yandex',
    header: 'Yandex',
    size: 100,
    cell: ({ row }) => {
      return h('div', h(X, { class: 'size-4' }))
    }
  },
  {
    id: 'editAction',
    cell: ({row}) => {
      return h(ProductRowActionButtons, { id: row.original.id })
    }
  },
]