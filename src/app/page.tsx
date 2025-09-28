"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Typography, Button, Input, Table, Spin } from "antd";
import type { InputRef } from "antd";
import { PatternFormat } from "react-number-format";
import type { TableProps } from "antd";
import { debounce } from "lodash-es";

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

interface TableParams {
  pagination: {
    current: number;
    pageSize: number;
    total?: number;
  };
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const searchInputRef = useRef<InputRef>(null);

  const fetchAdvocates = useCallback(
    async (currentPage: number, pageSize: number, search: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          ...(search && { searchTerm: search }),
        });

        const response = await fetch(`/api/advocates?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        setAdvocates(jsonResponse.data);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total: jsonResponse.total,
          },
        }));
      } catch (error) {
        // Error is recorded on the server side. We don't need to do more here for now.
        setError("Failed to fetch advocates.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAdvocates(
      tableParams.pagination.current,
      tableParams.pagination.pageSize,
      searchTerm,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchAdvocates,
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    searchTerm,
  ]);

  // Debounced function to update search term and reset to first page
  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        const currentValue = searchInputRef.current?.input?.value || "";
        setSearchTerm(currentValue);

        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            current: 1,
          },
        }));
      }, 500),
    [],
  );

  const onChange = () => {
    debouncedSearch();
  };

  const resetSearch = () => {
    if (searchInputRef.current?.input) {
      searchInputRef.current.input.value = "";
    }

    setSearchTerm("");

    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: 1,
      },
    }));
  };

  const handleTableChange: TableProps<Advocate>["onChange"] = (pagination) => {
    setTableParams((prev) => ({
      pagination: {
        current: pagination?.current || 1,
        pageSize: pagination?.pageSize || 10,
        total: prev.pagination.total,
      },
    }));
  };

  return (
    <AppLayout>
      <Typography.Title level={2}>Advocates</Typography.Title>

      <div className="flex gap-2 mb-4">
        <Input
          ref={searchInputRef}
          onChange={onChange}
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
            dataSource={advocates}
            columns={advocateColumns}
            pagination={{
              current: tableParams.pagination.current,
              pageSize: tableParams.pagination.pageSize,
              total: tableParams.pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            loading={isLoading}
            onChange={handleTableChange}
          />
        )}
      </div>
    </AppLayout>
  );
}
