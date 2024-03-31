import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import './index.css';

export function Dash() {
    return <div className="index-container">
        <div className="header">
            <h1>会议室预定系统-后台管理</h1>
            <Link to={'/update-userinfo'}><UserOutlined className="icon" /></Link>
        </div>
        <div className="body">
            <Outlet></Outlet>
        </div>
    </div>
}
