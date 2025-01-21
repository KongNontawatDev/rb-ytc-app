import React, { useMemo } from "react";
import { Spin } from "antd";
import { useRoomForDropdown } from "../hooks/useRoomQuery";
import Select from "../../../components/common/Select";

type RoomDropdownProps = {
  placeholder?: string;
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[] | undefined) => void;
  mode?: "multiple" | "tags";
  maxTagCount?: number | "responsive";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  label?: string;
  name?: string;
};

export default function RoomDropdown({value,onChange,label=""}:RoomDropdownProps) {
  // Fetching rooms using the custom hook
  const { data, isLoading } = useRoomForDropdown();

  // Map data for the Select component
  const options = useMemo(() => {
    if (!data?.data || data?.data.length === 0) return [];
    return data?.data.map((dept: { id: number | string; name: string }) => ({
      id: dept.id,
      name: dept.name,
    }));
  }, [data?.data]);

  // Show a loading spinner if data is loading
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <Spin />
      </div>
    );
  }

  return (
    <Select
      name={"room"}
      options={options}
      fieldValue="id"
      fieldLabel="name"
      value={value}
      onChange={onChange}
      label={label}
      placeholder={"เลือกห้องประชุม"}
    />
  );
}
