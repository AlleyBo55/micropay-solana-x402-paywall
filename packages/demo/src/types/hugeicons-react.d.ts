declare module 'hugeicons-react/dist/esm/icons/*' {
    import { FC, SVGProps } from 'react';
    export interface HugeIconProps extends SVGProps<SVGSVGElement> {
        size?: number | string;
    }
    const Icon: FC<HugeIconProps>;
    export default Icon;
}
