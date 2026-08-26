import { Skeleton, Box } from '@mui/material'

export default function SkeletonContainer() {
  return (
    <main>
      <Skeleton variant='text' sx={{ fontSize: '50px', width: '300px', margin: '.8em auto' }} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Skeleton variant='rectangular' width={480} height={290} sx={{ display: 'inline-block', margin: '0 2em' }} />
        <Skeleton variant='rectangular' width={480} height={290} sx={{ display: 'inline-block', margin: '0 2em' }} />
      </Box>
      <Box sx={{ width: '500px', margin: '2em auto' }}>
        <Skeleton />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </Box>
    </main>
  )
}
