type ButtonProps = {
    text?: string;
    children?: string;
}

export function Button(props: ButtonProps) {
    return (
        <button>{ props.children || props.text || "Clique aqui!" }</button>
    )
}