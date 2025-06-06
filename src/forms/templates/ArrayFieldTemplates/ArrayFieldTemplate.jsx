import { useEffect, useState } from "react";

import Button from "antd/lib/button";
import { Row, Col, Modal, Space, Tag, Checkbox, Table, theme } from "antd";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";
import EmptyArrayField from "./EmptyArrayField";
import AccordionArrayFieldTemplate from "./AccordionArrayFieldTemplate";
import LayerArrayFieldTemplate from "./LayerArrayFieldTemplate";
import PropTypes from "prop-types";
import axios from "axios";
import ImportListModal from "./ImportListModal";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import CodeViewer from "../../../utils/CodeViewer";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import FieldHeader from "../Field/FieldHeader";
import TitleField from "../../fields/internal/TitleField";

const ArrayFieldTemplate = ({
  canAdd,
  className,
  disabled,
  formContext,
  idSchema,
  items,
  options,
  onAddClick,
  readonly,
  required,
  schema,
  title,
  uiSchema,
  formData,
}) => {
  const { useToken } = theme;
  const { rowGutter = 24, hideAnchors } = formContext;

  const [latexData, setLatexData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [selectedEmailList, setSelectedEmailList] = useState(
    uiSchema["ui:options"] && uiSchema["ui:options"].email
      ? formData.map((user) => user?.profile?.email)
      : [],
  );
  const [copy, setCopy] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const { token } = useToken();

  let uiImport = null;
  let uiLatex = null;
  let uiEmail = null;
  let uiEmailDefaults = [];

  if (uiSchema["ui:options"]) {
    uiImport = uiSchema["ui:options"].import;
    uiLatex = uiSchema["ui:options"].latex;
    uiEmail = uiSchema["ui:options"].email;
    uiEmailDefaults = uiSchema["ui:options"].emailDefaults || [];
  }

  let arrayType = uiSchema?.["ui:array"] || "default";

  const getArrayContent = (type) => {
    const choices = {
      layer: (
        <LayerArrayFieldTemplate
          items={items}
          uiSchema={uiSchema}
          id={idSchema.$id}
        />
      ),
      accordion: (
        <AccordionArrayFieldTemplate
          items={items}
          formContext={formContext}
          id={idSchema.$id}
        />
      ),
      default: items.map((itemProps, index) => (
        <ArrayFieldTemplateItem
          key={idSchema.$id + index}
          {...itemProps}
          formContext={formContext}
        />
      )),
    };

    return choices[type] || choices["default"];
  };

  const _enableLatex = () => {
    let { items: { type } = {} } = schema;
    let { to } = uiImport;
    let data = formData;

    if (type == "object" && to) data = formData.map((item) => item[to] || "");

    if (!latexData) {
      axios
        .post("/api/services/latex", {
          title: title || "Title goes here",
          paths: data,
        })
        .then(({ data }) => {
          setLatexData(data.latex);
          setShowModal(true);
        })
        .catch(() => {
          if (!latexData) setLatexData(null);
        });
    } else {
      setShowModal(true);
    }
  };

  const updateEmailSelectedList = (email) => {
    selectedEmailList.includes(email)
      ? setSelectedEmailList((selectedEmailList) =>
          selectedEmailList.filter((item) => item != email),
        )
      : setSelectedEmailList((selectedEmailList) => [
          ...selectedEmailList,
          email,
        ]);
  };
  const updateEmailSelectedListAll = () => {
    formData.length === selectedEmailList.length
      ? setSelectedEmailList([])
      : setSelectedEmailList(formData.map((user) => user?.profile?.email));
  };

  useEffect(() => {
    if (emailModal && formData.length != selectedEmailList.length)
      setSelectedEmailList(formData.map((user) => user?.profile?.email));
  }, [emailModal]);

  return (
    <fieldset className={className} id={idSchema.$id}>
      {uiLatex && (
        <Modal
          destroyOnClose
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setLatexData(null);
          }}
          okText={copy ? "Copied" : "Copy to clipboard"}
          okButtonProps={{ icon: copy ? <CheckOutlined /> : <CopyOutlined /> }}
          onOk={() => {
            navigator.clipboard.writeText(decodeURI(latexData));
            setCopy(true);
          }}
        >
          <CodeViewer
            value={latexData}
            height="calc(100vh - 300px)"
            lang="stex"
            extraExtensions={[syntaxHighlighting(defaultHighlightStyle)]}
          />
        </Modal>
      )}
      {uiImport && (
        <ImportListModal
          open={importModal}
          uiImport={uiImport}
          schema={schema}
          formData={formData}
          onAddClick={onAddClick}
          formItems={items}
          onCancel={() => setImportModal(false)}
        />
      )}
      {uiEmail && formData && (
        <Modal
          open={emailModal}
          onCancel={() => setEmailModal(false)}
          title="Select user & egroups emails to send"
          okText="Send Email"
          okType="link"
          okButtonProps={{
            href: `mailto:${uiEmailDefaults
              .concat(selectedEmailList)
              .join(",")}`,
          }}
          width={900}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Checkbox
              onChange={() => updateEmailSelectedListAll()}
              checked={formData.length === selectedEmailList.length}
            >
              Select all
            </Checkbox>
            {uiEmailDefaults.length > 0 ? (
              <Col>
                Default email recepients:{" "}
                <Space>
                  {uiEmailDefaults.map((i) => (
                    <Tag key={i}>{i}</Tag>
                  ))}
                </Space>
              </Col>
            ) : null}
            <Table
              dataSource={formData.map((i) => i.profile || i)}
              columns={[
                {
                  title: "Email User",
                  key: "action",
                  render: (_, user) => (
                    <Checkbox
                      checked={selectedEmailList.includes(user.email)}
                      onChange={() => updateEmailSelectedList(user.email)}
                    />
                  ),
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                  render: (txt) => <Tag color="geekblue">{txt}</Tag>,
                },
                {
                  title: "Department",
                  dataIndex: "department",
                  key: "department",
                  render: (txt) => <Tag color="blue">{txt}</Tag>,
                },
              ]}
            />
          </Space>
        </Modal>
      )}
      <Row gutter={rowGutter}>
        {uiSchema["ui:label"] != false && (
          <div style={{ marginBottom: "8px", width: "100%" }}>
            <FieldHeader
              titleField={
                <TitleField
                  id={`${idSchema.$id}-title`}
                  fieldId={idSchema.$id}
                  key={`array-field-title-${idSchema.$id}`}
                  required={required}
                  title={uiSchema["ui:title"] || title}
                  uiImport={uiImport}
                  uiLatex={uiLatex}
                  uiEmail={uiEmail}
                  readonly={readonly}
                  enableLatex={() => _enableLatex()}
                  enableImport={() => setImportModal(true)}
                  enableEmail={() => setEmailModal(true)}
                  hideAnchors={hideAnchors}
                />
              }
              description={uiSchema["ui:description"] || schema.description}
              uiSchema={uiSchema}
              key={`array-field-header-${idSchema.$id}`}
              idSchema={idSchema}
            />
          </div>
        )}
        <Col
          span={24}
          style={{
            marginTop: "5px",
            ...(arrayType != "default" && { padding: 0 }),
          }}
          className={arrayType === "default" && "nestedObject"}
        >
          <Row>
            {items && (
              <Col span={24}>
                {items.length > 0 ? (
                  getArrayContent(arrayType)
                ) : (
                  <EmptyArrayField
                    canAdd={canAdd}
                    disabled={disabled}
                    readonly={readonly}
                    onAddClick={onAddClick}
                    options={options}
                  />
                )}
              </Col>
            )}
          </Row>
        </Col>
        {items && items.length > 0 && canAdd && !readonly && (
          <Col span={24} style={{ marginTop: "10px" }}>
            <Row gutter={rowGutter} justify="end">
              <Col style={{ padding: 0 }}>
                <Button
                  block
                  disabled={disabled || readonly}
                  onClick={onAddClick}
                  type="primary"
                  // This is needed since for some reason this particular button doesn't use the root
                  // styles (it has a different CSS hash className). This is the only solution that worked.
                  // FIXME: Check eventually if this can be fixed with a new @rjsf/antd or antd version.
                  style={{
                    borderRadius: token.borderRadius,
                    backgroundColor: token.colorPrimary,
                    fontFamily: token.fontFamily,
                  }}
                  data-cy="addItemButton"
                >
                  <PlusCircleOutlined /> Add{" "}
                  {options && options.addLabel ? options.addLabel : `Item`}
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </fieldset>
  );
};

ArrayFieldTemplate.propTypes = {
  canAdd: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  idSchema: PropTypes.object,
  items: PropTypes.array,
  onAddClick: PropTypes.func,
  prefixCls: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.object,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
};

export default ArrayFieldTemplate;
