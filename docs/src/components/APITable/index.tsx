import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react'

export interface APITableProps {
  data: APITableDataType[]
}

export type APITableDataType = {
  attribute: string
  description: string | React.ReactNode
  type: string | React.ReactNode
  default: string | React.ReactNode
}

export const APITable = ({ data }: APITableProps) => {
  const columns = [
    { key: 'attribute', label: 'Attribute' },
    { key: 'description', label: 'Description' },
    { key: 'type', label: 'Type' },
    { key: 'default', label: 'Default' },
  ]

  return (
    <Table
      aria-label="API Table"
      className="mt-3"
      shadow="none"
      radius="none"
      removeWrapper
      isStriped={false}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody items={data}>
        {data.map((row, index) => (
          <TableRow key={index}>
            {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
