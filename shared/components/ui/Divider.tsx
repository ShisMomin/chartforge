type Props = {
    classes?: string;
};
export default function Divider({ classes = '' }: Props) {
    return (
        <span className={`min-w-px h-10 bg-foreground mx-1 ${classes}`}></span>
    );
}
