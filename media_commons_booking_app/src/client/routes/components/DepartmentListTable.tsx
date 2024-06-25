import ListTable from './ListTable';
import React from 'react';
import { TableNames } from '../../../policy';

interface DepartmentField {
  name: string;
}

interface Props<T extends DepartmentField> {
  columnFormatters?: { [key: string]: (value: string) => string };
  tableName: TableNames;
  departmentList: T[];
  departmentListRefresh: () => Promise<void>;
}

export default function DepartmentListTable<T extends DepartmentField>(props: Props<T>) {
    return (
      <ListTable
        columnNameToRemoveBy="department"
        rows={props.departmentList as unknown as { [key: string]: string }[]}
        rowsRefresh={props.departmentListRefresh}
        {...props}
      />
    );
  }