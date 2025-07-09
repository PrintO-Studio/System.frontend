import { ColumnDef } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { h } from 'vue'

import ImageFile from '../imageFile.vue'
import ProductRowActionButtons from './productRowActionButtons.vue'
import IntegrationButton from './integrationButton.vue'
import { store } from '@/main'
import { displaySonnerError, displaySonnerSuccess } from '@/store/sonnerHelper'
import { ozonUpload } from '@/integrationHelper'

export interface Product {
    id: number,
    sku: string,
    name: string,
    series: string,
    primaryImage: any,
    versions: any
}

export const columns: ColumnDef<Product>[] = [
  {
    id: 'position',
    size: 30,
    cell: ({row}) => {
      return h('a', { class: 'content-center text-xs text-foreground/60'}, Number(row.id)+1)
    }
  },
  {
    id: 'image',
    header: '',
    cell: ({row}) => h(ImageFile, { class: 'size-32', file: row.original.primaryImage})
  },
  {
    id: 'sku',
    accessorKey: 'sku',
    header: 'Артикул',
    cell: ({row}) => h('h', { class: 'text-center' }, row.original.sku)
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Название',
    cell: ({ row }) => {
      return h(
        'div', 
        { class: 'flex flex-col min-w-96' },
        [
          h('p', { class: 'whitespace-break-spaces break-all font-medium' }, row.getValue('name')),
          h('p', { class: 'whitespace-break-spaces break-all text-xs text-foreground/60' }, row.original.series)
        ]
      )
    }
  },
  {
    id: 'Ozon',
    header: 'Ozon',
    size: 100,
    cell: ({ row }) => {
      async function upload() {
        await ozonUpload(
          row.original.id,
          (response) => {
            row.original.versions.ozonIntegrationVersion = response.data.value.versions.ozonIntegrationVersion
            row.original.versions.productVersion = response.data.value.versions.productVersion
            displaySonnerSuccess(`Интеграция успешна (SKU: ${response.data.value.sku}).`);
          },
          (error) => {
            displaySonnerError(error);
          },
        )
      }
      function update() { return upload() }

      return h(IntegrationButton, { 
        productVersion: row.original.versions.productVersion, 
        version: row.original.versions.ozonIntegrationVersion,
        onUpdate: update,
        onUpload: upload
      })
    }
  },
  {
    id: 'Wildberries',
    header: 'Wildberries',
    size: 100,
    cell: ({ row }) => {
      return h(IntegrationButton, { 
        productVersion: row.original.versions.productVersion, 
        version: row.original.versions.wildberriesIntegrationVersion,
        disabled: true
      })
    }
  },
  {
    id: 'Yandex',
    header: 'Yandex',
    size: 100,
    cell: ({ row }) => {
      return h(IntegrationButton, { 
        productVersion: row.original.versions.productVersion, 
        version: row.original.versions.yandexIntegrationVersion,
        disabled: true
      })
    }
  },
  {
    id: 'editAction',
    cell: ({row}) => {
      return h(ProductRowActionButtons, { id: row.original.id })
    }
  },
]