"use client";

import DataTable, { Column } from "@/components/DataTable";
import { faker } from "@faker-js/faker";

interface SeniorCitizen {
  id: number;
  fullName: string;
  age: number;
  address: string;
  contact: string;
  livingStatus: string;
  hasPension: string;
}

const generateData = (count: number): SeniorCitizen[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    fullName: faker.person.fullName(),
    age: faker.number.int({ min: 60, max: 90 }),
    address: faker.location.streetAddress(),
    contact: faker.phone.number({ style: "international" }),
    livingStatus: faker.helpers.arrayElement(["Alone", "With Family"]),
    hasPension: faker.helpers.arrayElement(["Yes", "No"]),
  }));
};

export default function DashboardPage() {
  const data: SeniorCitizen[] = generateData(5);

  const columns: Column<SeniorCitizen>[] = [
    { label: "OSCA #", accessor: "id" },
    { label: "Full Name", accessor: "fullName" },
    { label: "Age", accessor: "age" },
    { label: "Address", accessor: "address" },
    { label: "Contact #", accessor: "contact" },
    { label: "Living Status", accessor: "livingStatus" },
    { label: "Has Pension", accessor: "hasPension" },
  ];

  const renderActions = (item: SeniorCitizen) => (
    <div className="d-grid gap-2">
      <button className="btn btn-secondary btn-sm w-100">View</button>
      <button className="btn btn-primary btn-sm w-100">Approve</button>
      <button className="btn btn-danger btn-sm w-100">Decline</button>
    </div>
  );

  return (
    <section>
      <DataTable
        title="Deceased Citizens"
        data={data}
        columns={columns}
        searchableField="fullName"
        renderActions={renderActions}
      />
    </section>
  );
}
