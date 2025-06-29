<script lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, X } from 'lucide-vue-next'

import type { Product } from './columns'
import type { ColumnDef } from '@tanstack/vue-table'

export default {
  components: {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    FlexRender,
    X,
    Loader2,
  },
  props: {
    columns: {
      type: Array as () => ColumnDef<Product>[],
      required: true,
    },
    data: {
      type: Array as () => Product[],
      required: true,
    },
    isLoading : Boolean
  },
  setup(props) {
    const table = useVueTable({
      get data() { return props.data },
      get columns() { return props.columns },
      getCoreRowModel: getCoreRowModel(),
    })    

    return {
      table,
    }
  }
}
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <TableHead
          v-for="header in headerGroup.headers"
          :key="header.id"
          :style="{ width: header.getSize() + 'px' }"
        >
          <FlexRender
            v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="table.getRowModel().rows?.length">
        <TableRow
          v-for="row in table.getRowModel().rows" :key="row.id"
          :data-state="row.getIsSelected() ? 'selected' : undefined"
        >
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :style="{ width: cell.column.getSize() + 'px' }"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </template>
      <template v-else-if="isLoading">
        <TableRow>
          <TableCell :colspan="columns.length" class="h-32">
            <Loader2 class="text-primary size-4 animate-spin mx-[auto]"/>
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="columns.length" class="h-32 text-center">
            No results.
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>