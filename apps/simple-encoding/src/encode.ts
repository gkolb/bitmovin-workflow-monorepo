import 'dotenv/config';
const { ConsoleLogger } = require('@bitmovin/api-sdk');
// const BitmovinApi = require('@bitmovin/api-sdk').default;
import BitmovinApi, {
  H264VideoConfiguration,
  PresetConfiguration,
  AacAudioConfiguration,
  Encoding,
  CloudRegion,
  StreamInput,
  Stream,
  StreamSelectionMode,
  Fmp4Muxing,
  AclEntry,
  AclPermission,
  MuxingStream,
  EncodingOutput,
  DashManifestDefault,
  DashManifestDefaultVersion,
  HlsManifestDefault,
  HlsManifestDefaultVersion,
  StartEncodingRequest,
  ManifestGenerator,
  ManifestResource,
  S3Output,
  S3Input,
} from '@bitmovin/api-sdk';

const BITMOVIN_API_KEY = process.env.BITMOVIN_API_KEY || '';

if (!BITMOVIN_API_KEY) console.warn('API KEY MISSING');

// Setup client instance
const bitmovinApi = new BitmovinApi({
  apiKey: BITMOVIN_API_KEY,
  logger: new ConsoleLogger(),
});

export async function encode(inputPath: string) {
  // Create Input
  // AWS Input
  const input = await bitmovinApi.encoding.inputs.s3.create(
    new S3Input({
      name: 'First encoding input',
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
      bucketName: process.env.AWS_INPUT_BUCKET,
    })
  );

  // Reuse Inputs
  //   const input = await bitmovinApi.encoding.inputs.https.get('<INPUT_ID>');

  // Create Output
  // AWS S3 Bucket
  const output = await bitmovinApi.encoding.outputs.s3.create(
    new S3Output({
      name: 'First Encoding Output',
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
      bucketName: process.env.AWS_OUTPUT_BUCKET,
    })
  );
  const outputId = output.id;
  // Reuse Outputs
  //   const output = await bitmovinApi.encoding.outputs.gcs.get('<OUTPUT_ID>');

  // Video Codec Configurations
  const videoCodecConfiguration1 =
    await bitmovinApi.encoding.configurations.video.h264.create(
      new H264VideoConfiguration({
        name: 'Getting Started H264 Codec Config 1',
        bitrate: 1500000,
        width: 1024,
        presetConfiguration: PresetConfiguration.VOD_STANDARD,
      })
    );

  //   const videoCodecConfiguration2 =
  //     await bitmovinApi.encoding.configurations.video.h264.create(
  //       new H264VideoConfiguration({
  //         name: 'Getting Started H264 Codec Config 2',
  //         bitrate: 1000000,
  //         width: 768,
  //         presetConfiguration: PresetConfiguration.VOD_STANDARD,
  //       })
  //     );

  //   const videoCodecConfiguration3 =
  //     await bitmovinApi.encoding.configurations.video.h264.create(
  //       new H264VideoConfiguration({
  //         name: 'Getting Started H264 Codec Config 3',
  //         bitrate: 750000,
  //         width: 640,
  //         presetConfiguration: PresetConfiguration.VOD_STANDARD,
  //       })
  //     );

  // Audio Codec Conficuration
  const audioCodecConfiguration =
    await bitmovinApi.encoding.configurations.audio.aac.create(
      new AacAudioConfiguration({
        name: 'Getting Started Audio Codec Config',
        bitrate: 128000,
      })
    );

  // Create Encoding
  const encoding = await bitmovinApi.encoding.encodings.create(
    new Encoding({
      name: 'Getting Started Encoding',
      cloudRegion: CloudRegion.GOOGLE_EUROPE_WEST_1,
    })
  );

  // Streams
  // const inputPath = process.env.AWS_INPUT_PATH;

  const videoStreamInput = new StreamInput({
    inputId: input.id,
    inputPath: inputPath,
    selectionMode: StreamSelectionMode.AUTO,
  });

  if (encoding.id) {
    const videoStream1 = await bitmovinApi.encoding.encodings.streams.create(
      encoding.id,
      new Stream({
        codecConfigId: videoCodecConfiguration1.id,
        inputStreams: [videoStreamInput],
      })
    );

    // const videoStream2 = await bitmovinApi.encoding.encodings.streams.create(
    //   encoding.id,
    //   new Stream({
    //     codecConfigId: videoCodecConfiguration2.id,
    //     inputStreams: [videoStreamInput],
    //   })
    // );

    // const videoStream3 = await bitmovinApi.encoding.encodings.streams.create(
    //   encoding.id,
    //   new Stream({
    //     codecConfigId: videoCodecConfiguration3.id,
    //     inputStreams: [videoStreamInput],
    //   })
    // );

    const audioStreamInput = new StreamInput({
      inputId: input.id,
      inputPath: inputPath,
      selectionMode: StreamSelectionMode.AUTO,
    });

    const audioStream = await bitmovinApi.encoding.encodings.streams.create(
      encoding.id,
      new Stream({
        codecConfigId: audioCodecConfiguration.id,
        inputStreams: [audioStreamInput],
      })
    );

    // Muxing (Container Format)
    const aclEntry = new AclEntry({
      permission: AclPermission.PUBLIC_READ,
    });

    const segmentLength = 4;
    const outputPath = inputPath.split('.')[0];
    const segmentNaming = 'seg_%number%.m4s';
    const initSegmentName = 'init.mp4';

    const videoMuxing1 =
      await bitmovinApi.encoding.encodings.muxings.fmp4.create(
        encoding.id,
        new Fmp4Muxing({
          segmentLength: segmentLength,
          segmentNaming: segmentNaming,
          initSegmentName: initSegmentName,
          streams: [new MuxingStream({ streamId: videoStream1.id })],
          outputs: [
            new EncodingOutput({
              outputId: outputId,
              outputPath: outputPath + '/video/1024_1500000/fmp4/',
              acl: [aclEntry],
            }),
          ],
        })
      );
    console.log(videoMuxing1);

    // const videoMuxing2 =
    //   await bitmovinApi.encoding.encodings.muxings.fmp4.create(
    //     encoding.id,
    //     new Fmp4Muxing({
    //       segmentLength: segmentLength,
    //       segmentNaming: segmentNaming,
    //       initSegmentName: initSegmentName,
    //       streams: [new MuxingStream({ streamId: videoStream2.id })],
    //       outputs: [
    //         new EncodingOutput({
    //           outputId: outputId,
    //           outputPath: outputPath + '/video/768_1000000/fmp4/',
    //           acl: [aclEntry],
    //         }),
    //       ],
    //     })
    //   );

    // const videoMuxing3 =
    //   await bitmovinApi.encoding.encodings.muxings.fmp4.create(
    //     encoding.id,
    //     new Fmp4Muxing({
    //       segmentLength: segmentLength,
    //       segmentNaming: segmentNaming,
    //       initSegmentName: initSegmentName,
    //       streams: [new MuxingStream({ streamId: videoStream3.id })],
    //       outputs: [
    //         new EncodingOutput({
    //           outputId: outputId,
    //           outputPath: outputPath + '/video/640_750000/fmp4/',
    //           acl: [aclEntry],
    //         }),
    //       ],
    //     })
    //   );

    const audioMuxing =
      await bitmovinApi.encoding.encodings.muxings.fmp4.create(
        encoding.id,
        new Fmp4Muxing({
          segmentLength: segmentLength,
          segmentNaming: segmentNaming,
          initSegmentName: initSegmentName,
          streams: [new MuxingStream({ streamId: audioStream.id })],
          outputs: [
            new EncodingOutput({
              outputId: outputId,
              outputPath: outputPath + '/audio/128000/fmp4/',
              acl: [aclEntry],
            }),
          ],
        })
      );
    console.log(audioMuxing);

    // Create DASH Manifest
    const manifestOutput = new EncodingOutput({
      outputId: outputId,
      outputPath: outputPath,
      acl: [
        new AclEntry({
          permission: AclPermission.PUBLIC_READ,
          scope: '*',
        }),
      ],
    });
    let dashManifest = new DashManifestDefault({
      manifestName: 'stream.mpd',
      encodingId: encoding.id,
      version: DashManifestDefaultVersion.V2,
      outputs: [manifestOutput],
    });

    dashManifest = await bitmovinApi.encoding.manifests.dash.default.create(
      dashManifest
    );

    // Create HLS Manifest
    let hlsManifest = new HlsManifestDefault({
      manifestName: 'stream.m3u8',
      encodingId: encoding.id,
      version: HlsManifestDefaultVersion.V1,
      outputs: [manifestOutput],
    });

    hlsManifest = await bitmovinApi.encoding.manifests.hls.default.create(
      hlsManifest
    );

    // Start Encoding
    const startEncodingRequest = new StartEncodingRequest({
      manifestGenerator: ManifestGenerator.V2,
      vodDashManifests: [new ManifestResource({ manifestId: dashManifest.id })],
      vodHlsManifests: [new ManifestResource({ manifestId: hlsManifest.id })],
    });

    await bitmovinApi.encoding.encodings.start(
      encoding.id,
      startEncodingRequest
    );
  }
}
