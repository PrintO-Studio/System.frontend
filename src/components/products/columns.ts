import { ColumnDef } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { h } from 'vue'

import ImageFile from '../imageFile.vue'
import ProductRowActionButtons from './productRowActionButtons.vue'
import IntegrationButton from './integrationButton.vue'
import { store } from '@/main'
import { displaySonnerError, displaySonnerSuccess } from '@/store/sonnerHelper'
import { ozonUpdate, wbUpdate } from '@/integrationHelper'

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
    cell: ({row}) => h(ImageFile, { class: 'size-32', file: { fullPath: row.original.primaryImage }})
  },
  {
    id: 'sku',
    accessorKey: 'sku',
    header: 'Артикул',
    cell: ({row}) => h('h', { class: 'text-center' }, row.original.sku)
  },
  {
    id: 'warehouseStorageNumber',
    accessorKey: 'warehouseStorageNumber',
    header: 'Секция хранения'
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
      async function update() { 
        await ozonUpdate(
          row.original.id,
          (response) => {
            row.original.versions.ozon = response.data.value.versions.ozon
            row.original.versions.productVersion = response.data.value.versions.version
            displaySonnerSuccess(`Ozon Интеграция успешна (SKU: ${response.data.value.sku}).`);
          },
          (error) => {
            displaySonnerError(error);
          },
        )
      }

      return h(IntegrationButton, { 
        productVersion: row.original.versions.version, 
        integration: row.original.versions.ozon,
        onUpdate: update,
        onUpload: update
      })
    }
  },
  {
    id: 'Wildberries',
    header: 'Wildberries',
    size: 100,
    cell: ({ row }) => {
      async function update() { 
        await wbUpdate(
          row.original.id,
          (response) => {
            row.original.versions.wildberries = response.data.value.versions.wildberries
            row.original.versions.productVersion = response.data.value.versions.version
            displaySonnerSuccess(`Wildberries Интеграция успешна (SKU: ${response.data.value.sku}).`);
          },
          (error) => {
            displaySonnerError(error);
          },
        )
      }

      return h(IntegrationButton, { 
        productVersion: row.original.versions.version, 
        integration: row.original.versions.wildberries,
        onUpdate: update,
        onUpload: update
      })
    }
  },
  {
    id: 'Yandex',
    header: 'Yandex',
    size: 100,
    cell: ({ row }) => {
      return h(IntegrationButton, { 
        productVersion: row.original.versions.version, 
        integration: row.original.versions.yandex,
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