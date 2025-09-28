"use client";

import { useEffect, useState } from "react";
import { Typography, Button, Input, Table, Spin, Affix } from "antd";
import { NumericFormat } from "react-number-format";
import { PatternFormat } from "react-number-format";

import { Advocate } from "@/types/advocates";
import AppLayout from "@/components/app-layout";

const advocateColumns = [
  {
    key: "firstName",
    title: "First Name",
    dataIndex: "firstName",
  },
  {
    key: "lastName",
    title: "Last Name",
    dataIndex: "lastName",
  },
  {
    key: "city",
    title: "City",
    dataIndex: "city",
  },
  {
    key: "degree",
    title: "Degree",
    dataIndex: "degree",
  },
  {
    key: "specialties",
    title: "Specialties",
    dataIndex: "specialties",
    render: (specialties: string[]) => {
      return (
        <ul className="list-disc list-inside">
          {specialties.map((specialty) => (
            <li key={specialty}>{specialty}</li>
          ))}
        </ul>
      );
    },
  },
  {
    key: "yearsOfExperience",
    title: "Years of Experience",
    dataIndex: "yearsOfExperience",
  },
  {
    key: "phoneNumber",
    title: "Phone Number",
    dataIndex: "phoneNumber",
    render: (phoneNumber: string) => {
      return (
        <PatternFormat
          format="+1 (###) ###-####"
          value={phoneNumber}
          displayType="text"
          allowEmptyFormatting
          mask="_"
        />
      );
    },
  },
];

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        // Error is recorded on the server side. We don't need to do more here for now.
        setError("Failed to fetch advocates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredAdvocates = advocates.filter((advocate) => {
      const lowerSearchTerm = searchTerm.toLowerCase();

      return (
        advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.city.toLowerCase().includes(lowerSearchTerm) ||
        advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(lowerSearchTerm),
        ) ||
        advocate.yearsOfExperience
          .toString()
          .toLowerCase()
          .includes(lowerSearchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <AppLayout>
      <Typography.Title level={2}>Advocates</Typography.Title>

      <div className="flex gap-2 mb-4">
        <Input
          onChange={onChange}
          value={searchTerm}
          placeholder="Search for an advocate"
        />
        <Button onClick={resetSearch} variant="link" color="primary">
          Reset Search
        </Button>
      </div>

      <div>
        {isLoading && (
          <div className="flex justify-center items-center min-h-64">
            <Spin />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex justify-center items-center min-h-64">
            <Typography.Title level={5} className="text-red-500">
              {error}
            </Typography.Title>
          </div>
        )}

        {!isLoading && !error && (
          <Table
            rowKey="id"
            dataSource={filteredAdvocates}
            columns={advocateColumns}
          />
        )}
      </div>
    </AppLayout>
  );
}
