/* eslint-disable @next/next/no-img-element */

export const RenderIMGEl = ({
  logo,
  image,
  locale,
}: {
  logo: string;
  locale: string;
  image: string;
}) => {
  return (
    <div tw="flex relative flex-col p-12 w-full h-full rounded bg-gray-900 text-white items-center">
      <div tw="flex  items-center my-5">
        <img src={logo} alt="ChadNext Logo" tw="h-10 mr-2" />
        <div tw="text-xl font-bold tracking-tight text-white">ChadNext</div>
        <div
          style={{
            marginLeft: 10,
          }}
        >
          {locale ? "/" + locale : ""}
        </div>
      </div>
      <img src={image} alt="ChadNext Logo" tw=" rounded-lg" />
    </div>
  );
};
