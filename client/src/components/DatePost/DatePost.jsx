import React, { useState, useEffect } from "react";
import moment from "moment";
import viLocale from "moment/locale/vi";
const DatePost = ({ date }) => {
    const [dateFormat, setDateFormat] = useState(null);
    moment.locale("vi", [viLocale]);
    useEffect(() => {
        const datePost = new Date(date);
        const dateCurrent = new Date();
        if (Number(dateCurrent.getDate()) - Number(datePost.getDate()) > 1) {
            setDateFormat(`${datePost.getDate()}/${datePost.getMonth() + 1}/${datePost.getFullYear()}`);
        } else {
            setDateFormat(moment(date).fromNow());
        }
    }, [date]);
    return <span className="time-read">{dateFormat}</span>;
};

export default DatePost;
