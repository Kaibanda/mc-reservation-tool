
import React, { useContext, useMemo, useState } from 'react';
import { DatabaseContext } from '../../components/Provider';
//import DepartmentListTable from '../../components/DepartmentListTable';
import DepartmentListTable from '../../booking/components/DepartmentListTable';
import Loading from '../../../utils/Loading';
import { formatDate } from '../../../utils/date';
import { TableNames, getLiaisonTableName } from '../../../../policy';
import { serverFunctions } from '../../../utils/serverFunctions';

const AddDepartmentForm = ({ departmentList, reloadDepartments }) => {
  const [department, setDepartment] = useState('');
  const [tier, setTier] = useState('');
  const [loading, setLoading] = useState(false);

  const addDepartment = async () => {
    if (department === '' || tier === '') {
      alert('Please fill in all the fields');
      return;
    }

    if (departmentList.some(d => d.name === department)) {
      alert('This department is already registered');
      return;
    }

    setLoading(true);
    try {
      await serverFunctions.appendRowActive(getLiaisonTableName(), [
        department,
        tier,
        new Date().toString(),
      ]);
      await reloadDepartments();
    } catch (ex) {
      console.error(ex);
      alert('Failed to add department');
    } finally {
      setLoading(false);
      setDepartment('');
      setTier('');
    }
  };

  return (
    <div className="mt-10 mr-10 ml-10">
      <form className="flex items-center">
        <div className="mr-6">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
            value={department}
          >
            <option value="" disabled>
              Select Department
            </option>
            <option value="ALT">ALT</option>
            <option value="GameCenter">Game Center</option>
            <option value="IDM">IDM</option>
            <option value="ITP / IMA / Low Res">ITP / IMA / Low Res</option>
            <option value="MARL">MARL</option>
            <option value="Music Tech">Music Tech</option>
            <option value="Recorded Music">Recorded Music</option>
            <option value="others">Other Group</option>
          </select>
        </div>
        <div className="mr-6">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              setTier(e.target.value);
            }}
            value={tier}
          >
            <option value="" disabled>
              Select Tier
            </option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Tertiary">Tertiary</option>
          </select>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <button
            type="button"
            onClick={addDepartment}
            className="h-[40px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Department
          </button>
        )}
      </form>
    </div>
  );
};

export default AddDepartmentForm

export const Departments = () => {
    const { departments, reloadDepartments } = useContext(DatabaseContext);
  
    const departmentList = useMemo(
      () => departments.map(department => ({
        name: department.name,
        tier: department.tier,
        createdAt: department.createdAt,
      })),
      [departments]
    );
  
    return (
      <>
        <AddDepartmentForm
          departmentList={departmentList}
          reloadDepartments={reloadDepartments}
        />
        <DepartmentListTable
        tableName = {TableNames.DEPARTMENTS}
          departmentList={departmentList}
          departmentListRefresh={reloadDepartments}
          columnFormatters={{ createdAt: formatDate }}
        />
      </>
    );
  };

