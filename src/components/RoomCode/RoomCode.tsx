import './RoomCode.scss';
import copyImg from "../../assets/images/copy.svg";
import { useState } from "react";

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        
        let x = document.getElementById("snackbar") as any;
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
            <div id="snackbar">Copy room code: {props.code}</div>
        </button>
    )
}