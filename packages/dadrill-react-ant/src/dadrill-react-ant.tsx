import { DrillRenderer, ValueProps } from "dadrill-react";
import { Collapse, Flex, Input, Pagination, Space, Typography } from "antd";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

const WrapArray = (props: {
  items: Array<{ child: React.ReactNode; label: string }>;
}) => {
  const MIN_PAGE_SIZE = 10;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(MIN_PAGE_SIZE);

  const pagination =
    props.items.length > MIN_PAGE_SIZE ? (
      <Pagination
        onShowSizeChange={(_, size) => setPageSize(size)}
        defaultCurrent={page}
        total={props.items.length}
        onChange={(p) => setPage(p - 1)}
      />
    ) : null;

  return (
    <Flex gap={32} vertical>
      {pagination}
      <Collapse
        items={props.items
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((v, i) => ({
            key: i,
            label: v.label,
            children: <div key={i}>{v.child}</div>,
          }))}
      ></Collapse>
      {pagination}
    </Flex>
  );
};

const WrapObject = (props: {
  items: Array<{ child: React.ReactNode; label: string }>;
}) => {
  return (
    <Flex gap={32} vertical>
      <Space direction="vertical">
        {props.items.map((v, i) => (
          <Flex key={i} gap={16} vertical>
            <Typography.Text strong>{v.label}</Typography.Text>
            {v.child}
          </Flex>
        ))}
      </Space>
    </Flex>
  );
};

const JsonEditor: React.FC<ValueProps> = ({ onChange, value }) => {
  if (typeof value === "string") {
    return value.length > 100 ? (
      <TextArea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    ) : (
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    );
  }

  if (typeof value === "number") {
    return (
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <Input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  return <span>unknown</span>;
};

export const renderer: DrillRenderer = {
  WrapArray: WrapArray,
  WrapObject: WrapObject,
  WrapValue: JsonEditor,
};
