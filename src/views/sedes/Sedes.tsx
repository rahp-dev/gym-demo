import { Button, Card, Skeleton } from '@/components/ui'
import { HiOutlinePencil } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { useGetAllSedesQuery } from '@/services/RtkQueryService'
import { Sede } from '@/services/sedes/types/sede.types'

const Sedes = () => {
  const navigate = useNavigate()
  const { data, isFetching } = useGetAllSedesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )

  const Cards = ({
    clickable,
    header,
    headerClass,
    onClick,
    children,
  }: any) => {
    return (
      <div
        className={`${
          clickable ? 'cursor-pointer' : ''
        } hover:-translate-y-1 hover:shadow-lg transition duration-200 ease-in-out xl:max-w-xs md:max-w-xs lg:max-w-xs mobile:w-full sp:w-full border border-gray-200 rounded-lg`}
        onClick={onClick}
      >
        <div className={headerClass}>{header}</div>
        <div className="px-4">{children}</div>
      </div>
    )
  }

  return (
    <div>
      <h3>Sedes</h3>
      <div className="flex xl:flex-row xl:flex-wrap 2xl:gap-20 lg:flex-row lg:flex-wrap lg:gap-6 md:flex-wrap mobile:flex-wrap mobile:gap-8 sp:flex-wrap sp:gap-8 mt-8">
        {isFetching && (
          <>
            <div className="flex flex-col" style={{ maxWidth: 300 }}>
              <Skeleton height={190} width={300} />
              <div className="flex flex-auto items-center gap-2">
                <div>
                  <Skeleton variant="circle" height={35} width={35} />
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <Skeleton height={10} />
                  <Skeleton height={10} width="60%" />
                </div>
              </div>
            </div>
            <div className="flex flex-col" style={{ maxWidth: 300 }}>
              <Skeleton height={190} width={300} />
              <div className="flex flex-auto items-center gap-2">
                <div>
                  <Skeleton variant="circle" height={35} width={35} />
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <Skeleton height={10} />
                  <Skeleton height={10} width="60%" />
                </div>
              </div>
            </div>
          </>
        )}

        {!isFetching &&
          data?.map((data: Sede, index, id) => (
            <Cards
              key={index}
              clickable
              id={id}
              header={
                <div className="rounded-tl-lg rounded-tr-lg overflow-hidden p-0 max-h-[180px]">
                  <img
                    src={data.image}
                    className="object-cover h-[180px] w-[320px] mobile:w-full sp:w-full"
                    alt="card header"
                  />
                </div>
              }
              headerClass="p-0"
              onClick={(e: any) =>
                console.log(`Card ${data.name} clickable`, e)
              }
            >
              <div className="flex flex-row justify-between items-center">
                <h4 className="font-bold my-5">{data.name}</h4>
                <Button
                  onClick={() => {
                    navigate(`editar-sede/${data.id}`)
                  }}
                  variant="solid"
                  color="pink-500"
                  size="sm"
                  icon={<HiOutlinePencil />}
                >
                  Editar
                </Button>
              </div>
            </Cards>
          ))}

        <Card
          onClick={() => {
            navigate('crear')
          }}
          className="flex xl:max-w-xs md:max-w-xs lg:max-w-xs h-64 hover:border-pink-500 hover:border-solid hover:bg-white hover:text-pink-500 group w-full flex-col items-center justify-center border-2 border-dashed border-slate-400 text-sm leading-6 text-slate-800 font-semibold py-3 cursor-pointer dark:bg-transparent dark:text-white"
        >
          <div className="flex flex-col items-center">
            <svg
              className="group-hover:text-pink-500 mb-1 text-slate-400"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            <p>Crear sede</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Sedes
