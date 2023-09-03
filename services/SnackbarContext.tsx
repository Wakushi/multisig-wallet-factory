import {createContext, useState, ReactNode} from 'react';

interface SnackbarContextProviderProps {
    children: ReactNode;
}

interface SnackbarContextProps {
    isSnackbarShowing: boolean;
    snackbarMessageType: string;
    openSnackBar: (type:string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
    isSnackbarShowing: false,
    snackbarMessageType: "copy",
    openSnackBar: (type:string) => {},
});

export default function SnackbarContextProvider(props: SnackbarContextProviderProps) {
    const [isSnackbarShowing, setIsSnackbarShowing] = useState(false)
    const [snackbarMessageType, setSnackbarMessageType] = useState("copy")
    function openSnackBar(type: string): void {
        setSnackbarMessageType(type)
        setIsSnackbarShowing(true)
        setTimeout(() => {
            setIsSnackbarShowing(false)
        }, 2000)
    }

    const context: SnackbarContextProps = {
        isSnackbarShowing: isSnackbarShowing,
        snackbarMessageType: snackbarMessageType,
        openSnackBar: openSnackBar,
    };

    return (
        <SnackbarContext.Provider value={context}>
            {props.children}
        </SnackbarContext.Provider>
    );
}

export {SnackbarContext};
