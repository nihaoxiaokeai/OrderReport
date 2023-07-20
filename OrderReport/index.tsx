import * as React from "react";
import * as qs from "query-string";
import Table from "../../components/GroupsTable";
import Tag from "../../components/GroupsTag";
import NoData from "../../components/NoData";
import * as styles from "./index.scss";
import * as api from "../../services/orderWarning";
import { Toast } from "antd-mobile";
import { REPORTERROR } from "../OrderWarning/statusData";
import { withRouter, Route } from "react-router-dom";

const { useState, useEffect, useRef, useLayoutEffect } = React;

export default withRouter(
  React.memo(() => {
    const [error, setError] = useState(null);
    const [msgId, setMsgId] = useState("");
    const [pushDate, setPushDate] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
      const params = qs.parse(window.location.search);
      const { msgid } = params;
      setMsgId(msgid);
      fetchData(msgid);
    }, []);

    const fetchData = (msgid) => {
      Toast.loading("加载中...", null, null, true);
      api
        .getSaleWarnDaily({ msgid }, true)
        .then((res: any) => {
          Toast.hide();
          if (res) {
            const {
              pageTitle,
              dateNow,
              dataType,
              orderWarnDailyTypeList = [],
            } = res;
            document.title = pageTitle;
            REPORTERROR.title[0].name = dataType;
            setPushDate(dateNow);
            setData(orderWarnDailyTypeList);
          }
        })
        .catch((err) => {
          Toast.hide();
          setError(err);
        });
    };

    return (
      <div>
        {error ? (
          <NoData />
        ) : (
          <>
            {pushDate && <Tag name={pushDate} width="150" />}
            <div className={styles.wrap}>
              <Table data={data} height="88" columns={REPORTERROR} />
            </div>
          </>
        )}
      </div>
    );
  })
);
