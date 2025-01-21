import React, { useState, useEffect } from "react";
import {
  Dropdown,
  Button,
  Checkbox,
  Input,
  Row,
  Col,
  Space,
  Tag,
  Flex,
  Spin,
} from "antd";
import { MenuProps } from "antd";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";

interface DropdownOption {
  label: string;
  value: string | number;
  color?: string;
}

interface MultiSelectDropdownProps {
	title:string
  selectedValues: string;
  setSelectedValues: (values: string) => void;
  options: DropdownOption[];
  loading: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
	title,
  selectedValues,
  setSelectedValues,
  options,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>([]);

  const { t } = useTranslation("common");

  // Convert string to array when component mounts or selectedValues changes
  useEffect(() => {
    if (selectedValues) {
      setInternalSelected(selectedValues.split(",").map(value => 
        !isNaN(Number(value)) ? Number(value) : value
      ));
    } else {
      setInternalSelected([]);
    }
  }, [selectedValues]);

  const handleCheckboxChange = (checkedValues: (string | number)[]) => {
    const normalizedValues = checkedValues.map((value) =>
      typeof value === "number" ? Number(value) : value
    );
    setSelectedValues(normalizedValues.join(","));
  };

  const handleSelectAll = () => {
    setSelectedValues(options.map((opt) => opt.value).join(","));
  };

  const handleClearSelection = () => {
    setSelectedValues("");
    setSearchTerm("");
  };

  const handleRemoveItem = (valueToRemove: string | number) => {
    const normalizedValue =
      typeof valueToRemove === "number" ? Number(valueToRemove) : valueToRemove;
    const newValues = internalSelected.filter((value) => value !== normalizedValue);
    setSelectedValues(newValues.join(","));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const dropdownContent: MenuProps["items"] = [
    {
      key: "search",
      label: (
        <Input
          size="small"
          placeholder={t("search", { data: title })}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          disabled={loading}
        />
      ),
    },
    ...(loading
      ? [
          {
            key: "loading",
            label: (
              <div className="flex justify-center items-center py-2">
                <Spin size="small" /> {t("loading")}
              </div>
            ),
          },
        ]
      : filteredOptions.length > 0
      ? [
          {
            key: "checkboxGroup",
            label: (
              <Checkbox.Group
                value={internalSelected}
                onChange={handleCheckboxChange}
                className="flex flex-col"
              >
                {filteredOptions.map((option) => (
                  <Checkbox key={option.value} value={option.value}>
                    {option.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            ),
          },
        ]
      : [
          {
            key: "noOptions",
            label: <div className="text-center">{t("noData", { data: title })}</div>,
          },
        ]),
    {
      key: "actions",
      label: (
        <Row justify="space-between" align="middle" className="mb-2">
          <Col>
            <Button size="small" type="text" onClick={handleSelectAll} disabled={loading}>
              {t("selectAll")}
            </Button>
          </Col>
          <Col>
            <Button size="small" type="text" onClick={handleClearSelection} disabled={loading}>
              {t("clear")}
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  const renderSelectedValues = () => {
    if (internalSelected.length === 0) return t("select",{data:title});

    if (internalSelected.length > 3) {
      return (
        <Space>
          <span>{t("select",{data:title})}:</span>
          <Tag color="blue">{t("selected", { data: internalSelected.length })}</Tag>
        </Space>
      );
    }

    return (
      <Flex>
        <span className="me-2">{t("select",{data:title})} : </span>
        {internalSelected.map((value, index) => {
          const normalizedValue =
            typeof value === "number" ? Number(value) : value;
          const option = options.find((opt) => opt.value === normalizedValue);
          
          return (
            <Tag
              key={index}
              color={option?.color || 'default'}
              closable
              onClose={() => handleRemoveItem(normalizedValue)}
            >
              {option?.label || "Unknown"}
            </Tag>
          );
        })}
      </Flex>
    );
  };

  return (
    <Dropdown
      menu={{ items: dropdownContent }}
      trigger={["click"]}
      onOpenChange={handleOpenChange}
      open={open}
      className=""
    >
      <Button type="dashed" icon={<PlusCircleOutlined />}>
        {renderSelectedValues()}
      </Button>
    </Dropdown>
  );
};

export default MultiSelectDropdown;