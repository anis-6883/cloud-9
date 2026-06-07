import React from "react";

export default function BreadcrumbWrapper({
  children,
  addBtn,
  title,
  description,
  titleIcon
}: {
  children: React.ReactNode;
  addBtn?: React.ReactNode;
  title: string;
  description: string;
  titleIcon?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col'>
          <h2 className='flex items-center gap-2 text-xl font-semibold'>
            {titleIcon} {title}
          </h2>
          <p className='text-muted-foreground'>{description}</p>
        </div>

        {addBtn}
      </div>

      {children}
    </div>
  );
}
