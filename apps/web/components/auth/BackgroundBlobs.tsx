export function BackgroundBlobs() {
    return (
        <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-3xl rounded-full opacity-20 animate-pulse" />
            <div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-primary/30 blur-3xl rounded-full opacity-20 animate-pulse"
                style={{ animationDelay: '1s' }}
            />
        </>
    );
}
