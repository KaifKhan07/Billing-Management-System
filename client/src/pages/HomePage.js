import React, { useState, useEffect, useRef } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import ReactToPrint from 'react-to-print';
import { Link } from "react-router-dom";
import { API_URL } from "./helper"
const { RangePicker } = DatePicker;

const HomePage = () => {
  const componentRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("365");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Project",
      dataIndex: "project",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Work Status",
      dataIndex: "work_status",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <span title={text}>
          {text && text.length > 60 ? `${text.slice(0, 60)}...` : text}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (text) => (
        <span title={text}>
          {text && text.length > 45 ? `${text.slice(0, 45)}...` : text}
        </span>
      ),
    },
    {
      title: "Actions",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              console.log(record)
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  //getall transactions

  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post(`${API_URL}/transections/get-transection`, {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });
      setAllTransection(res.data);
      setLoading(false);
    } catch (error) {
      message.error("Fetch Issue With Tranction");
    }
  };

  //useEffect Hook
  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type, setAllTransection]);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/transections/delete-transection`, {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
      getAllTransactions()
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post(`${API_URL}/transections/edit-transection`, {
          payload: {
            ...values,
            userId: user._id,
          },
          transacationId: editable._id,
        });
        setLoading(false);

        message.success("Transaction Updated Successfully");
      } else {
        await axios.post(`${API_URL}/transections/add-transection`, {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      getAllTransactions()
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("please fill all fields");
    }
  };

  return (
    <Layout>

      {loading && <Spinner />}

      <div className="filters frequency">
        <div>
          <h6>Select Frequency</h6>
          <Select className="my-custom-select" value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div className="filter-tab ">
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="bill">Bill</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"
              }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"
              }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>

          <button
            className="btn btn-primary newbtn"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
          <ReactToPrint
            trigger={() => <button className="btn btn-primary print-css newbtn">Print</button>}
            content={() => componentRef.current}
          />
          <Link className="btn btn-primary print-css newbtn" to="/Payment">Payment</Link>
        </div>
      </div>
      <div ref={componentRef} className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransection} />
        ) : (
          <Analytics allTransection={allTransection} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transection"}
        open={showModal}
        onCancel={() => {
          setEditable(null);
          setShowModal(false);
        }}
        footer={false}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Invoice No" name="invoice_no">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Project" name="project">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="bill">Bill</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="product">Product</Select.Option>
              <Select.Option value="bill">Bill</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="service fee">Service Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Work Status" name="work_status">
            <Select>
              <Select.Option value="advance">ADVANCE</Select.Option>
              <Select.Option value="concept design">CONCEPT DESIGN</Select.Option>
              <Select.Option value="rcc work completion">RCC WORK COMPLETION</Select.Option>
              <Select.Option value="service fee">Service Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
              <Select.Option value="finishing work completion">FINISHING WORK COMPLETION</Select.Option>
              <Select.Option value="completion of entire building">COMPLETION OF ENTIRE BUILDING</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Phone Number" name="phone_number">
            <Input type="number" required />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary newbtn1">
              {" "}
              <div> SAVE </div> 
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;

