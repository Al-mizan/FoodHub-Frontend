export interface HomeProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}