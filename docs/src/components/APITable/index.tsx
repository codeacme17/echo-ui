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
    { key: 'attribute', label: '属性' },
    { key: 'description', label: '说明' },
    { key: 'type', label: '类型' },
    { key: 'default', label: '默认' },
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
