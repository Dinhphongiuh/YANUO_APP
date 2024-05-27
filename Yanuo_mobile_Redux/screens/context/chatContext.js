import React, {useState, useContext, createContext, useRef, useEffect} from "react";

const MessageContext = createContext(null);

export const MessageProvider = ({children}) => {
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);


    return (
        <MessageContext.Provider
            value={{sendMessage, setSendMessage, receiveMessage, setReceiveMessage}}
        >
            {children}
        </MessageContext.Provider>
    )
}

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context)
    {
        throw new Error('UseMessage must be used within a MessageProvider');
    }
    return context;
}