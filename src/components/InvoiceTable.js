import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const InvoiceTable = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const columns = [
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      width: "25%",
    },
    {
      title: "Cost Price",
      dataIndex: "costPrice",
      key: "costPrice",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Margin %",
      dataIndex: "marginPercent",
      key: "marginPercent",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Margin",
      dataIndex: "margin",
      key: "margin",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      key: "salesPrice",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Total Sales Price",
      dataIndex: "totalSalesPrice",
      key: "totalSalesPrice",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Discount %",
      dataIndex: "discountPercent",
      key: "discountPercent",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Tax %",
      dataIndex: "taxPercent",
      key: "taxPercent",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Final Sales Price",
      dataIndex: "finalSalesPrice",
      key: "finalSalesPrice",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            onClick={() => handleEdit(record.id)}
            size="small"
          >
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            onClick={() => handleDelete(record.id)}
            size="small"
            danger
          >
            <DeleteOutlined />
          </Button>
        </span>
      ),
      width: "25%",
    },
  ];

  const fetchInvoices = useCallback(async () => {
    let url = `${baseUrl}/invoices`;
    await axios
      .get(url)
      .then((response) => {
        if (response?.data?.data) {
          response.data.data = response.data.data.map((data) => {
            return {
              ...data,
              key: data.id,
            };
          });
          setDataSource(response.data.data);
        } else {
          setDataSource([]);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  }, [baseUrl]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setSelectedInvoice(null);
  };

  const onFinish = (values) => {
    let url = `${baseUrl}/invoice`;
    axios
      .post(url, values)
      .then((response) => {
        if (response?.data?.status === "success") {
          fetchInvoices();
          handleCancel();
          message.success(response.data.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleEdit = (id) => {
    let currentInvoice = dataSource.find((data) => data.id === id);
    form.setFieldsValue({
      qty: currentInvoice?.qty || 0,
      costPrice: currentInvoice?.costPrice || 0,
      marginPercent: currentInvoice?.marginPercent || 0,
      margin: currentInvoice?.margin || 0,
      salesPrice: currentInvoice?.salesPrice || 0,
      totalSalesPrice: currentInvoice?.totalSalesPrice || 0,
      discountPercent: currentInvoice?.discountPercent || 0,
      discount: currentInvoice?.discount || 0,
      taxPercent: currentInvoice?.taxPercent || 0,
      tax: currentInvoice?.tax || 0,
      finalSalesPrice: currentInvoice?.finalSalesPrice || 0,
    });
    setSelectedInvoice(currentInvoice);
    setOpen(true);
  };

  const updateInvoice = async (values) => {
    console.log(selectedInvoice);
    let url = `${baseUrl}/invoice/${selectedInvoice?.id}`;
    axios
      .put(url, values)
      .then((response) => {
        if (response?.data?.status === "success") {
          fetchInvoices();
          handleCancel();
          message.success(response.data.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleDelete = async (id) => {
    let url = `${baseUrl}/invoice/${id}`;
    await axios
      .delete(url)
      .then((response) => {
        if (response?.data?.status === "success") {
          fetchInvoices();
          message.success(response.data.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const onChangeHandler = () => {
    let currentValues = form.getFieldsValue();
    const {
      costPrice,
      discount,
      discountPercent,
      margin,
      marginPercent,
      qty,
      salesPrice,
      taxPercent,
      tax,
      totalSalesPrice,
    } = currentValues;

    const Margin = (Number(costPrice) * Number(marginPercent)) / 100;
    const SalesPrice = Number(costPrice) + Number(margin);
    const TotalSalesPrice = Number(qty) * Number(salesPrice);
    const Discount = (Number(totalSalesPrice) * Number(discountPercent)) / 100;
    const Tax = (Number(totalSalesPrice) * Number(taxPercent)) / 100;
    const FinalSalesPrice =
      Number(totalSalesPrice) - (Number(discount) + Number(tax));

    form.setFieldsValue({
      margin: Margin,
      salesPrice: SalesPrice,
      totalSalesPrice: TotalSalesPrice,
      discount: Discount,
      tax: Tax,
      finalSalesPrice: FinalSalesPrice,
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          justifyContent: "end",
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setSelectedInvoice(null);
            form.setFieldsValue({ firstName: "", lastName: "", city: "" });
            setOpen(true);
          }}
        >
          + Add
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ y: 465 }}
        bordered
        components={{
          header: {
            cell: (props) => (
              <th style={{ background: "#e5e5e5" }}>{props.children}</th>
            ),
          },
        }}
      />

      <Modal
        title={selectedInvoice ? "Edit Invoice" : "Add Invoice"}
        open={open}
        onCancel={handleCancel}
        footer={false}
        maskClosable={false}
        width={850}
      >
        <Form
          style={{
            maxWidth: 850,
            margin: 0,
            padding: 0,
          }}
          initialValues={
            selectedInvoice
              ? {
                  qty: selectedInvoice?.qty || 0,
                  costPrice: selectedInvoice?.costPrice || 0,
                  marginPercent: selectedInvoice?.marginPercent || 0,
                  margin: selectedInvoice?.margin || 0,
                  salesPrice: selectedInvoice?.salesPrice || 0,
                  totalSalesPrice: selectedInvoice?.totalSalesPrice || 0,
                  discountPercent: selectedInvoice?.discountPercent || 0,
                  discount: selectedInvoice?.discount || 0,
                  taxPercent: selectedInvoice?.taxPercent || 0,
                  tax: selectedInvoice?.tax || 0,
                  finalSalesPrice: selectedInvoice?.finalSalesPrice || 0,
                }
              : {
                  qty: 0,
                  costPrice: 0,
                  marginPercent: 0,
                  margin: 0,
                  salesPrice: 0,
                  totalSalesPrice: 0,
                  discountPercent: 0,
                  discount: 0,
                  taxPercent: 0,
                  tax: 0,
                  finalSalesPrice: 0,
                }
          }
          onFinish={selectedInvoice ? updateInvoice : onFinish}
          autoComplete="off"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Qty"
                name="qty"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input qty!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Cost Price"
                name="costPrice"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your cost price!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                style={{ textAlign: "center" }}
                label="Margin %"
                name="marginPercent"
                rules={[
                  {
                    required: true,
                    message: "Please input your margin %!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Margin"
                name="margin"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your margin!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Sales Price"
                name="salesPrice"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your sales price!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Total Sales Price"
                name="totalSalesPrice"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your total sales price!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Discount %"
                name="discountPercent"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your discount %!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Discount"
                name="discount"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your discount!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Tax %"
                name="taxPercent"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your tax %!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tax"
                name="tax"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your tax!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Final Sales Price"
                name="finalSalesPrice"
                style={{ textAlign: "center" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your final sales price!",
                  },
                ]}
              >
                <Input
                  style={{ maxWidth: "265px", float: "right" }}
                  type="number"
                  onBlur={onChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            wrapperCol={{
              offset: 10,
              span: 14,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoiceTable;
