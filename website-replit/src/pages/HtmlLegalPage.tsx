import SubPageLayout from "@/layouts/SubPageLayout";

type HtmlLegalPageProps = {
  title: string;
  src: string;
};

export default function HtmlLegalPage({ title, src }: HtmlLegalPageProps) {
  return (
    <SubPageLayout className="p-0">
      <iframe
        title={title}
        src={src}
        className="w-full min-h-[calc(100vh-5rem)] border-0 bg-white"
      />
    </SubPageLayout>
  );
}
