import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export const Notifications = ({ color = '#0C1A30', ...props }: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <G clipPath="url(#clip0)">
      <Path
        d="M18.796 11.385L17.212 5.689c-.464-1.67-1.472-3.135-2.865-4.165-1.393-.93-3.09-1.475-4.822-1.425-1.731.05-3.397.673-4.734 1.775-1.336 1.1-2.268 2.616-2.645 4.306l-1.226 5.512c-.135.609-.132 1.24.009 1.848.141.608.418 1.176.808 1.663.39.487.885.88 1.448 1.15.563.27 1.179.41 1.803.41h.925c.19.942.702 1.789 1.446 2.397.744.608 1.676.94 2.637.94.961 0 1.893-.332 2.637-.94.744-.608 1.255-1.446 1.446-2.397h.699c.642 0 1.276-.149 1.851-.434.576-.285 1.077-.699 1.466-1.21.388-.511.653-1.105.774-1.736.12-.63.094-1.281-.077-1.909v-.001zm-8.796 6.949c-.515-.002-1.017-.163-1.437-.461-.42-.298-.737-.72-.91-1.206h4.39c-.172.486-.49.908-.91 1.206-.42.298-.922.459-1.437.461zm6.772-4.321c-.232.308-.533.558-.878.73-.345.172-.726.26-1.112.258h-9.782c-.375 0-.742-.084-1.079-.246-.337-.162-.636-.398-.86-.69-.224-.292-.389-.633-.474-1-.085-.367-.086-.745-.02-1.111l1.225-5.463c.296-1.328 1.027-2.519 2.078-3.383 1.05-.864 2.359-1.352 3.719-1.387 1.36-.035 2.692.361 3.786 1.17 1.094.809 1.886 1.96 2.251 3.271l1.59 5.696c.105.37.122.76.049 1.139-.073.379-.233.735-.467 1.041z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
