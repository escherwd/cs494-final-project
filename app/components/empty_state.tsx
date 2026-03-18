export default function EmptyState({ children, text }: { children: React.ReactNode, text: string }) {
    return (
        <div className="py-12 flex flex-col justify-center items-center gap-3 text-gray-400">
        {children}
        {text}
      </div>
    );
}