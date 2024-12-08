import React from 'react';
import AddClass from './AddClass';
import EditClass from './EditClass';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { schoolClass } from './Data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { ChevronRight } from "lucide-react"
import { H2, H3, H4, P } from './ui/typography';
import { Separator } from './ui/separator';

export default function Classes(props: any) {
  const { data, setSelectedClassID } = props;

  return (
    // <Card variant="elevation" sx={{ height: '100%', width: 'auto', maxWidth: '300px', p:2 }}>
    //     <Typography sx={{pt: 2, pb: 1}} variant="h4" fontWeight="bold">All Classes</Typography>
    //     <div>
    //         {
    //             data.classes.map((x: schoolClass) => (
    //                 <div key={x.id} >
    //                     <Card variant="filled" sx={{my: 2, mx: 2, px:2 }}>
    //                         <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
    //                             <div>
    //                                 <h3 >{x.name}</h3>
    //                                 <p >{x.number}</p>
    //                             </div>
    //                             <Stack direction="column" spacing={0} alignItems="center">
    //                                 <Box >
    //                                     <Tooltip placement="top" title="Select this class">
    //                                         <IconButton onClick={() => {setSelectedClassID(x.id)}}>
    //                                             <ArrowRightIcon fontSize="large" />
    //                                         </IconButton>
    //                                     </Tooltip>
    //                                 </Box>
    //                                 <EditClass classID={x.id} {...props} />
    //                             </Stack>
    //                         </Stack>
    //                     </Card>
    //                 </div>
    //             ))
    //         }
    //     </div>

    //     <Divider></Divider>

    //     <AddClass {...props}></AddClass>
    // </Card>
    <Card className="h-full w-auto max-w-[300px] m-4">
      <CardHeader>
        <CardTitle>
            <H2>All Classes</H2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
            {data.classes.map((x: schoolClass) => (
            <div key={x.id}>
                <Card className="p-4">
                <div className="flex flex-row items-center justify-between">
                    <div>
                    <H4>{x.name}</H4>
                    <P>{x.number}</P>
                    </div>
                    <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            {/* <Button variant="outline" size="icon"> */}
                                <ChevronRight />
                            {/* </Button> */}
                        </TooltipTrigger>
                        <TooltipContent>
                            Select this class
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                </div>
                </Card>
            </div>
            ))}

          <AddClass {...props}></AddClass>
        </div>


      </CardContent>
    </Card>
  );
}
